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
import BookAppointmentForm from "@/components/user/patient/appointments/BookAppointmentForm";
import { fetchAppointments, getBookingInfo } from "@/api/patient/patientApis";


const PatientAppointments = () => {
  const [appointments, setAppointments] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const fetchAppointmentsAction = useAsyncAction();
  const navigate= useNavigate();

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
    navigationState?.defaultTab || "upcoming",
  );

  //------------- Get all appointments -----------------
  const fetchAllAppointments = () => {
    fetchAppointmentsAction.executeAsyncFn(async () => {
      try {
        const response = await fetchAppointments();

        if (!response.data.success) {
          return toast.error("Failed to load appointments");
        }

        setAppointments(response?.data?.appointments);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  //---------------- Search Suggestions ---------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "appointment",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  //-------------- View Appointment ----------------
  const handleView = (id) =>{
    navigate(`/patient/appointments/${id}`)
  }

  const filteredAppointments = appointments?.filter((appointment) => {
    if (activeTab === "upcoming") {
      return appointment?.status === "confirmed";
    } else if (activeTab === "history") {
      return appointment?.status === "completed";
    } else if (activeTab === "cancelled") {
      return appointment?.status === "cancelled";
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

  //------------------- Fetch selected doc info (prefill form) -----------
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

  const displayedAppointments = query.trim()
    ? filteredSearchResult
    : filteredAppointments;

  const isLoading = fetchAppointmentsAction.loading;

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
                Patient · Appointments
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Manage Appointments
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Book new appointments or review your upcoming and past
                consultations.
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
                  Loading appointments...
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <PatientAppointmentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      {activeTab !== "book" && (
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-2 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon icon="mdi:clipboard-text-outline" />
                {activeTab === "upcoming"
                  ? "Upcoming Appointments"
                  : activeTab === "history"
                    ? "Past Appointments"
                    : "Book New Appointment"}
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
                columns={patientAppointmentColumns}
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
    </div>
  );
};

export default PatientAppointments;
