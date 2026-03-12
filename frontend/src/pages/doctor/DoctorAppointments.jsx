import React, { useEffect, useState } from "react";
import { doctorAppointmentColumns } from "@/components/shared/configs/TableConfigs";
import DataTable from "@/components/shared/components/DataTable";
import DoctorAppointmentTabs from "@/components/user/doctor/appointments/DoctorAppointmentTabs";
import SearchInput from "@/components/shared/components/SearchInput";
import { fetchSearchSuggestions } from "@/api/user/userApis";
import { useSearch } from "@/hooks/useSearch";
import { Icon } from "@iconify/react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { fetchAppointments } from "@/api/doctor/doctorApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import DoctorStatusBanner from "@/components/user/doctor/profile/DoctorStatusBanner";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import { useUser } from "@/contexts/UserContext";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState(null);
  const fetchAppointmentsAction = useAsyncAction();
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
  } = useSearch({
    type: "appointments",
    role: "doctor",
  });

  const fetchAllAppointments = () => {
    fetchAppointmentsAction.executeAsyncFn(async () => {
      try {
        const response = await fetchAppointments();

        if (!response.data.success) {
          return toast.error("Failed to load appointments");
        }

        setAppointments(response?.data?.appointments);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  //------------ Search Suggestions ------------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "doctor",
      query,
      type: "appointment",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  //------------- View Appointments -----------------
  // const handleView = (id) => {
  //   const appointment = displayedAppointments.find((a) => a._id === id);
  //   openModal("Choose Appointment Status", AppointmentsActionModal, {
  //     appointment,
  //     id: appointment._id,
  //     role: "doctor",
  //   });
  // };

  const handleView = (id) => {
    navigate(`/doctor/appointments/${id}`);
  };

  const filteredAppointments = appointments?.filter((appointment) => {
    if (activeTab === "upcoming") {
      return appointment?.status === "confirmed";
    } else if (activeTab === "history") {
      return appointment?.status === "completed";
    } else if (activeTab === "pending") {
      return appointment?.status === "pending";
    } else if (activeTab === "cancelled") {
      return appointment?.status === "cancelled";
    } else if (activeTab === "expired") {
      return appointment?.status === "expired";
    }
    return true;
  });

  const filteredSearchResult = results?.filter((appointment) => {
    if (activeTab === "upcoming") {
      return appointment?.status === "upcoming";
    } else if (activeTab === "history") {
      return appointment?.status === "completed";
    }
    return true;
  });

  const displayedAppointments = query.trim()
    ? filteredSearchResult
    : filteredAppointments;

  const isLoading = fetchAppointmentsAction.loading;

  return (
    <div className="min-h-screen">
      <DoctorStatusBanner
        approvalStatus={user?.status}
        submissionCount={user?.submissionCount}
        variant="doctor"
      />
      {user?.isBlocked ? (
        <>
          <BlockedProfile />
        </>
      ) : (
        <>
          {/* Header band */}
          <PageBanner
            config={pageBannerConfig.doctorAppointments}
            activeTab={activeTab}
            isLoading={isLoading}
            tabsComponent={
              <DoctorAppointmentTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />

          {/* Search Section */}
          {activeTab !== "book" && (
            <div className="mx-auto px-4 pb-2 pt-2 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search appointments"
                    fetchSuggestions={fetchSuggestions}
                    onSelectSuggestion={handleSelectSuggestion}
                    role="patient"
                    entity="appointments"
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
          <div className="mx-auto px-4 pt-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Icon icon="mdi:clipboard-text-outline" />
                    {activeTab === "upcoming"
                      ? "Upcoming Appointments"
                      : activeTab === "pending"
                        ? "Pending Confirmation"
                        : activeTab === "history"
                          ? "Past Appointments"
                          : activeTab === "cancelled"
                            ? "Cancelled Appointments"
                            : "Appointments"}
                  </h2>

                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Icon icon="mdi:format-list-bulleted" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                      {filteredAppointments?.length ?? 0}
                    </span>
                    records in this view
                  </div>
                </div>
              </div>

              <div className="px-2 py-3 sm:px-4">
                {activeTab === "book" ? (
                  <BookAppointmentForm
                    onSuccess={fetchAllAppointments}
                    bookingInfo={bookingInfo}
                    setActiveTab={setActiveTab}
                  />
                ) : filteredAppointments && filteredAppointments.length > 0 ? (
                  <DataTable
                    data={displayedAppointments}
                    columns={doctorAppointmentColumns}
                    onView={(id) => handleView(id)}
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
                      No appointments in this view
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                      {activeTab === "upcoming"
                        ? "You have no upcoming appointments. Book one to get started!"
                        : "You have no past appointments yet."}
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

export default DoctorAppointments;
