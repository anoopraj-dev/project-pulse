import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "../../components/shared/components/DataTable";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { fetchDoctorPayments } from "@/api/doctor/doctorApis";
import { getReceipt } from "@/api/user/userApis";
import { doctorPaymentColumns } from "@/components/shared/configs/TableConfigs";
import DoctorPaymentTabs from "../../components/user/doctor/payments/DoctorPaymentTabs";
import { useUser } from "@/contexts/UserContext";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import DoctorStatusBanner from "@/components/user/doctor/profile/DoctorStatusBanner";
import BlockedProfile from "@/components/shared/components/BlockedProfile";


const DoctorPayments = () => {
  const [payments, setPayments] = useState(null);
  const [activeTab, setActiveTab] = useState("all");


  const fetchPaymentsAction = useAsyncAction();
  const { role,user } = useUser();

  // -------- Fetch All Doctor Payments ----------
  const fetchAllPayments = () => {
    fetchPaymentsAction.executeAsyncFn(async () => {
      try {
        const response = await fetchDoctorPayments();

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

  // -------- View Receipt ----------
  const handleView = async (id) => {
    try {
      const res = await getReceipt(id, role);

      const url = window.URL.createObjectURL(res.data);
      window.open(url);
    } catch (error) {
      toast.error("Failed to open receipt");
    }
  };

  // -------- Filter Logic ----------
  const filteredPayments = payments?.filter((payment) => {
    if (activeTab === "all") {
      return payment?.status !== "created";
    } else if (activeTab === "verified") {
      return payment?.status === "verified";
    } else if (activeTab === "failed") {
      return payment?.status === "failed";
    } else if (activeTab === "refunded") {
      return payment?.status === "refunded";
    }
    return true;
  });

  const isLoading = fetchPaymentsAction.loading;

  return (
    <div className="min-h-screen">
      <DoctorStatusBanner
            approvalStatus={user?.status}
            submissionCount={user?.submissionCount}
            variant="doctor"
          />
     {
      user?.isBlocked ? (
        <>
          
          <BlockedProfile/>
        </>
      ):(
        <>
           {/* Header */}
      <PageBanner
        config={pageBannerConfig.doctorPayments}
        activeTab={activeTab}
        isLoading={isLoading}
        tabsComponent={
          <DoctorPaymentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
      />

      {/* Table Section */}
      <div className="mx-auto px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon icon="mdi:cash-multiple" />
                Doctor Payments
              </h2>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <Icon icon="mdi:format-list-bulleted" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                  {filteredPayments?.length ?? 0}
                </span>
                records
              </div>
            </div>
          </div>

          <div className="px-2 py-3 sm:px-4">
            {filteredPayments && filteredPayments.length > 0 ? (
              <DataTable
                data={filteredPayments}
                columns={doctorPaymentColumns}
                onView={(id) => handleView(id)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <Icon
                    icon="mdi:cash-remove"
                    className="text-xl text-slate-400"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No payments found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  You don’t have any transactions in this view yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )
     }
    </div>
  );
};

export default DoctorPayments;
