import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { getAllPatients } from "../../api/admin/adminApis";
import toast from "react-hot-toast";
import DataTable from "../../components/shared/components/DataTable";
import { patientColumns } from "../../components/shared/configs/TableConfigs";
import PatientStatusTabs from "../../components/user/admin/patients/PatientStatusTabs";
import { useNavigate } from "react-router-dom";

const ViewPatients = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [patients, setPatients] = useState(null);
  const navigate = useNavigate();
  const fetchPatientsAction = useAsyncAction();

  const fetchAllPatients = () => {
    fetchPatientsAction.executeAsyncFn(async () => {
      try {
        const res = await getAllPatients();

        if (!res?.data?.success) {
          return toast.error(res?.data?.message || "Failed to load data");
        }

        setPatients(res?.data?.users || []);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const handleView = (id) => {
    navigate(`/admin/patient/${id}`);
  };

  const filteredPatients = patients?.filter(
    (patient) => patient?.status === activeTab
  );

  const isLoading = fetchPatientsAction.loading;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header band */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Title + subtitle */}
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                <Icon icon="mdi:shield-account-outline" />
                Admin · Patients
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Manage Patients
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                View and manage patient accounts by status with a clean, tabbed
                table view.
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
                    className="animate-spin text-sky-500"
                  />
                  Loading patients...
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <PatientStatusTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon icon="mdi:account-multiple-outline" />
                {activeTab === "active"
                  ? "Active patients"
                  : activeTab === "inactive"
                  ? "Inactive patients"
                  : activeTab === "blocked"
                  ? "Blocked patients"
                  : "Patients"}
              </h2>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <Icon icon="mdi:format-list-bulleted" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
                  {filteredPatients?.length ?? 0}
                </span>
                records in this view
              </div>
            </div>
          </div>

          <div className="px-2 py-3 sm:px-4">
            {filteredPatients && filteredPatients.length > 0 ? (
              <DataTable
                data={filteredPatients}
                columns={patientColumns}
                onView={handleView}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <Icon
                    icon="mdi:account-off-outline"
                    className="text-xl text-slate-400"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No patients in this state
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Switch tabs to view patients in other statuses or onboard new
                  patients from the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatients;
