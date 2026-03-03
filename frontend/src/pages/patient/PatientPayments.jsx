import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "../../components/shared/components/DataTable";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { fetchPatientPayments } from "@/api/patient/patientApis";
import SearchInput from "../../components/shared/components/SearchInput";
import { fetchSearchSuggestions, getReceipt } from "@/api/user/userApis";
import { useSearch } from "../../hooks/useSearch";
import { patientPaymentColumns } from "@/components/shared/configs/TableConfigs";
import PatientPaymentTabs from "@/components/user/patient/payments/PaymentTabs";
import { useUser } from "@/contexts/UserContext";
import { handleRazorpayPayment } from "@/utilis/handleRazorpayPayment";
import { retryPayment } from "@/api/patient/patientApis";
import { useNavigate } from "react-router-dom";

const PatientPayments = () => {
  const [payments, setPayments] = useState(null);
  const fetchPaymentsAction = useAsyncAction();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { role,user} = useUser();
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

    await handleRazorpayPayment({
      order,
      role,
      user, 
      onSuccess: () => {
        fetchAllPayments(); // refresh table
      },
      onFailure: () => {
        navigate('/patient/payments'); // navigate to payments
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
    } else if (activeTab === "refunds") {
      return payment?.status === "refunded";
    }
    return true;
  });

  const filteredSearchResult = results?.filter((payment) => {
    if (activeTab === "success") {
      return payment?.status === "verified";
    } else if (activeTab === "history") {
      return payment?.status === "completed";
    }
    return true;
  });

  useEffect(() => {}, [activeTab]);

  const displayedPayments = query.trim()
    ? filteredSearchResult
    : filteredPayments;

  const isLoading = fetchPaymentsAction.loading;

  return (
    <div className="min-h-screen">
      {/* Header band */}
      <div className="my-2">
        <div className="my-2 rounded-xl mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-indigo-50 via-white to-sky-100 pt-20 pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Title + subtitle */}
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                <Icon icon="mdi:calendar-heart" />
                Patient · Payments
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Payments History
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                View and download tranactinos information.
              </p>
            </div>

            {/* Status meta + loading */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
                <Icon
                  icon="mdi:circle"
                  className="text-[10px] text-emerald-500"
                />
                <span>
                  Active tab:{" "}
                  <span className="capitalize font-semibold text-slate-900">
                    {activeTab}
                  </span>
                </span>
              </div>

              {isLoading && (
                <span className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                  <Icon
                    icon="mdi:loading"
                    className="animate-spin text-indigo-500"
                  />
                  Loading payments...
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <PatientPaymentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      {/* {activeTab !== "book" && (
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
      )} */}

      {/* Content section */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon icon="mdi:clipboard-text-outline" />
                {activeTab === "upcoming"
                  ? "All payments"
                  : activeTab === "history"
                    ? "Past Appointments"
                    : "Book New Appointment"}
              </h2>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <Icon icon="mdi:format-list-bulleted" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                  {filteredPayments?.length ?? 0}
                </span>
                records in this view
              </div>
            </div>
          </div>

          <div className="px-2 py-3 sm:px-4">
            {filteredPayments && filteredPayments.length > 0 ? (
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
    </div>
  );
};

export default PatientPayments;
