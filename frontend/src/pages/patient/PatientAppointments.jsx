import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import toast from "react-hot-toast";
import DataTable from "../../components/shared/components/DataTable";
import { patientAppointmentColumns } from "../../components/shared/configs/TableConfigs";
import PatientAppointmentTabs from "../../components/user/patient/appointments/AppointmentTabs";
import SearchInput from "../../components/shared/components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import { fetchSearchSuggestions } from "../../api/user/userApis";
import BookAppointmentForm from "@/components/user/patient/appointments/booking/BookAppointmentForm";
import { fetchAppointments, getBookingInfo } from "@/api/patient/patientApis";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { useUser } from "@/contexts/UserContext";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import Pagination from "@/components/shared/components/Pagination";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const fetchAppointmentsAction = useAsyncAction();
  const navigate = useNavigate();
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
  } = useSearch({
    type: "appointments",
    role: "patient",
  });

  const location = useLocation();
  const navigationState = location.state;
  const [activeTab, setActiveTab] = useState(
    navigationState?.defaultTab || "confirmed",
  );

  // ---------------- GET ALL APPOINTMENTS ----------------
  const fetchAllAppointments = () => {
    fetchAppointmentsAction.executeAsyncFn(async () => {
      try {
        const response = await fetchAppointments(page, 5, activeTab);
        if (!response.data.success) {
          return toast.error("Failed to load appointments");
        }

        setAppointments(response?.data?.data?.data);
        setTotalPages(response?.data?.data?.pagination.totalPages);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllAppointments();
  }, [activeTab, page]);

  // ---------------- SEARCH SUGGESTIONS ----------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "appointments",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  // ---------------- VIEW APPOINTMENT ----------------
  const handleView = (id) => {
    navigate(`/patient/appointments/${id}`);
  };

  const getStatusFromTab = (tab) => {
    const mapping = {
      confirmed: ["confirmed", "ongoing", "pending"],
      history: ["completed"],
      cancelled: ["cancelled"],
      expired: ["expired"],
    };
    return mapping[tab] || [tab];
  };


  const filteredAppointments = appointments?.filter((appointment) => {
    if (activeTab === "all") return true;
    const statuses = getStatusFromTab(activeTab);
    return statuses.includes(appointment?.status);
  });

  const filteredSearchResult = results?.filter((appointment) => {
    if (activeTab === "all") return true;
    const statuses = getStatusFromTab(activeTab);
    return statuses.includes(appointment?.status);
  });



  // ---------------- FETCH SELECTED DOC INFO (PREFILL FORM) ----------------
  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (!navigationState?.selectedDoctorId) return;

      try {
        const response = await getBookingInfo(navigationState.selectedDoctorId);

        if (response?.data?.success) {
          setBookingInfo(response.data.bookingInfo);
        } else {
          toast.error("Failed to load booking info");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load booking info");
      }
    };

    fetchBookingInfo();
  }, []);

  useEffect(() => {}, [activeTab]);

  const displayedAppointments = (query.trim()
    ? filteredSearchResult
    : filteredAppointments)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const isLoading = fetchAppointmentsAction.loading;

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <>
          {/* Header band */}
          <PageBanner
            config={pageBannerConfig.patientAppointments}
          />


          <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-6">
            {/* Search Section */}
            {activeTab !== "book" && (
              <div className="w-full pb-2">
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
            <div className="w-full">
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 dark:border-gray-800/80 px-4 py-4 sm:px-6">
                <PatientAppointmentTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Icon icon="mdi:clipboard-text-outline" />
                    {activeTab === "confirmed"
                      ? "Upcoming Appointments"
                      : activeTab === "history"
                        ? "Past Appointments"
                        : activeTab === "cancelled"
                          ? "Cancelled Appointments"
                          : "Book New Appointment"}
                  </h2>

                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 dark:bg-gray-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
                    <Icon icon="mdi:format-list-bulleted" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
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
                    columns={patientAppointmentColumns}
                    onView={(id) => handleView(id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-gray-800 ring-1 ring-slate-200 dark:ring-gray-700">
                      <Icon
                        icon="mdi:calendar-remove-outline"
                        className="text-xl text-slate-400"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                      No appointments in this view
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                      {activeTab === "upcoming"
                        ? "You have no upcoming appointments. Book one to get started!"
                        : "You have no past appointments yet."}
                    </p>
                  </div>
                )}
                {activeTab !== "book" && (
                  <div className="border-t border-slate-50 dark:border-gray-800/80 p-2">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export default PatientAppointments;
