import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "../../components/shared/components/DataTable";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import {
  bookAppointment,
  fetchPatientPayments,
} from "@/api/patient/patientApis";
import SearchInput from "../../components/shared/components/SearchInput";
import { fetchSearchSuggestions, getReceipt } from "@/api/user/userApis";
import { useSearch } from "../../hooks/useSearch";
import { patientPaymentColumns } from "@/components/shared/configs/TableConfigs";
import PatientPaymentTabs from "@/components/user/patient/payments/PaymentTabs";
import { useUser } from "@/contexts/UserContext";
import { handleRazorpayPayment } from "@/utilis/handleRazorpayPayment";
import { retryPayment } from "@/api/patient/patientApis";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";

const PatientPayments = () => {
  const [payments, setPayments] = useState(null);
  const fetchPaymentsAction = useAsyncAction();
  const [activeTab, setActiveTab] = useState("all");
  const { role, user } = useUser();
  const navigate = useNavigate();
 

  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
  } = useSearch({
    type: "payments",
    role: "patient",
  });

  //------------- Get all payments -----------------
  const fetchAllPayments = () => {
    fetchPaymentsAction.executeAsyncFn(async () => {
      try {
        const response = await fetchPatientPayments();

        if (!response.data.success) {
          return toast.error("Failed to load payments");
        }

        setPayments(response?.data?.payments);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  //---------------- Search Suggestions ---------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "payments",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  //--------------- View / Retry Payments --------------
  const handleAction = async (id, type) => {
    //-------------------- Retry Payment --------------------
    if (type === "retry") {
      try {
        const response = await retryPayment(id);

        if (!response.data?.success) {
          return toast.error(response.data?.message || "Retry failed");
        }

        const order = response.data.order;
        const bookingData = response.data.bookingData;

        await handleRazorpayPayment({
          order,
          role,
          user,
          onSuccess: async () => {
            try {
              await bookAppointment({
                ...bookingData,
                orderId: order.id,
              });
              toast.success("Appointment booked successfully");
              fetchAllPayments(); // refresh table
            } catch (error) {
              console.log(error);
              toast.error("Appointment booking failed");
            }
          },
          onFailure: () => {
            navigate("/patient/payments"); // navigate to payments
          },
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Retry failed");
      }
    } else {
      //-------------------- View Receipt --------------------
      const res = await getReceipt(id, role);

      const url = window.URL.createObjectURL(res.data);
      window.open(url);
    }
  };

  const filteredPayments = payments?.filter((payment) => {
    if (activeTab === "all") {
      return payment?.status !== "created";
    } else if (activeTab === "success") {
      return payment?.status === "verified";
    } else if (activeTab === "failed") {
      return payment?.status === "failed";
    } else if (activeTab === "refunded") {
      return payment?.status === "refunded";
    }
    return true;
  });

const filteredSearchResult = results?.filter((payment) => {
  if (activeTab === "success") return payment?.status === "verified";
  if (activeTab === "failed") return payment?.status === "failed";
  if (activeTab === "refunded") return payment?.status === "refunded";
  return payment?.status !== "created";
});

  useEffect(() => {}, [activeTab]);

  const displayedPayments = query.trim()
    ? filteredSearchResult
    : filteredPayments;

  const isLoading = fetchPaymentsAction.loading;

  return (
    <div className="min-h-screen">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <>
          <BlockedProfile />
        </>
      ) : (
        <>
          {/* Header band */}
          <PageBanner
            config={pageBannerConfig.patientPayments}
            activeTab={activeTab}
            isLoading={isLoading}
            tabsComponent={
              <PatientPaymentTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />

          {/* Search Section */}
          {activeTab !== "book" && (
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-2 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payments"
                fetchSuggestions={fetchSuggestions}
                onSelectSuggestion={handleSelectSuggestion}
                role="patient"
                entity="payments"
              />
              {searchLoading && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Icon icon="mdi:loading" className="animate-spin" />
                  Searching…
                </div>
              )}
            </div>
          </div>
        </div>
      )}

          {/* Content section */}
          <div className="mx-auto  px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Icon icon="mdi:clipboard-text-outline" />
                    {activeTab === "all"
                      ? "All payments"
                      : activeTab === "success"
                        ? "Succesful Payments"
                      : activeTab === "failed"
                        ? "Failed Payments"
                        : activeTab === "refunded"
                        ? "Refunds"
                        : ""}
                  </h2>

                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Icon icon="mdi:format-list-bulleted" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                      {displayedPayments?.length ?? 0}
                    </span>
                    records in this view
                  </div>
                </div>
              </div>

              <div className="px-2 py-3 sm:px-4">
                {displayedPayments && displayedPayments.length > 0 ? (
                  <DataTable
                    data={displayedPayments}
                    columns={patientPaymentColumns}
                    onView={handleAction}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                      <Icon
                        icon="mdi:calendar-remove-outline"
                        className="text-xl text-slate-400"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                      No payments in this view
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                      {activeTab === "upcoming"
                        ? "You have no upcoming payments. Book one to get started!"
                        : "You have no past payments yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientPayments;
