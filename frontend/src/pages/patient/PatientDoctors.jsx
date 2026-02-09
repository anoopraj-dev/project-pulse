import { useAsyncAction } from "../../hooks/useAsyncAction";
import { getAllDoctors } from "../../api/patient/patientApis";
import { useEffect, useState } from "react";
import DoctorCard from "../../components/shared/components/DoctorCard";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../components/shared/components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import ApplyFilters from "../../components/shared/components/ApplyFilters";
import { doctorFilterConfig } from "../../components/shared/configs/FilterConfigs";
import { fetchSearchSuggestions } from "../../api/user/userApis";


const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const fetchDoctorsAction = useAsyncAction();
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({});

  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
  } = useSearch({
    type: "doctors",
    role: "patient",
  });

  //---------------- Get all doctors --------------
  const fetchAllDoctors = () => {
    fetchDoctorsAction.executeAsyncFn(async () => {
      try {
        const res = await getAllDoctors();

        if (!res?.data?.success) {
          return toast.error(res?.data?.message || "Failed to load doctors");
        }

        setDoctors(res?.data?.users || []);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  //------------------ Apply Filters --------------------
  const applyAllFilters = (list, filters) => {
    if (!filters || Object.keys(filters).length === 0) return list;

    return list.filter((doc) =>
      Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toLowerCase().trim();
        if (!filterValue) return true;

        if (key === "specialization") {
          const specs = doc?.professionalInfo?.specializations;
          if (!specs) return false;

          return Array.isArray(specs)
            ? specs.some((s) => s.toLowerCase().includes(filterValue))
            : specs.toLowerCase().includes(filterValue);
        }

        if (key === "location") {
          return doc.location?.toLowerCase().includes(filterValue);
        }

        if (key === "feesRange") {
          return Number(doc.fees) <= Number(filterValue);
        }

        return true;
      })
    );
  };

  //--------------- Search Suggestions -------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "doctor",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  //------------ View Doctor Profile -------------

  const handleProfileView = (id) => {
    navigate(`/patient/doctor/${id}`);
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const approvedDoctors = doctors.filter((doc) => doc.status === "approved");
  const searchedDoctors = query.trim().length > 0 ? results : approvedDoctors;
  const visibleDoctors = applyAllFilters(searchedDoctors, searchFilters);
  const isInitialLoading = fetchDoctorsAction.loading;

  return (
    <div className="min-h-screen ">
      {/* Full-width Header Banner */}
      <section className="my-2 rounded-xl mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-sky-50 via-white to-cyan-100 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sky-600">
                <Icon icon="mdi:account-heart-outline" className="text-lg" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Find a doctor
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
                Available Doctors
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Browse verified doctors and compare consultation charges before booking.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm ring-1 ring-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700">
                  {approvedDoctors.length}{" "}
                  <span className="font-medium text-slate-900">doctors available</span>
                </span>
              </div>

              {isInitialLoading && (
                <div className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                  <Icon icon="mdi:loading" className="animate-spin text-sm" />
                  Loading doctors…
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative z-40 mb-8">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors "
            fetchSuggestions={fetchSuggestions}
            onSelectSuggestion={handleSelectSuggestion}
            role='patient'
            entity='doctors'
          />

          {searchLoading && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Icon icon="mdi:loading" className="animate-spin" />
              Searching…
            </div>
          )}
        </div>

        {/* Filters + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Sidebar: ApplyFilters */}
          <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
            <ApplyFilters onApply={setSearchFilters} config={doctorFilterConfig} />
          </div>

          {/* Main Content: Doctors Grid */}
          <div className="flex-1 lg:min-w-0">
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
              {visibleDoctors?.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  onView={() => handleProfileView(doc._id)}
                />
              ))}
            </div>

            {!isInitialLoading &&
              !searchLoading &&
              visibleDoctors?.length === 0 && (
                <div className="mt-20 flex flex-col items-center text-center text-slate-500">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <Icon
                      icon="mdi:stethoscope"
                      className="text-2xl text-slate-400"
                    />
                  </div>

                  <h2 className="mt-4 text-base font-semibold text-slate-900">
                    {query.trim()
                      ? "No matching doctors found"
                      : "No doctors available"}
                  </h2>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    {query.trim()
                      ? "Try searching with a different name or specialization."
                      : "Approved doctors will appear here once they are added by the admin."}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mt-8">
          <ApplyFilters onApply={setSearchFilters} config={doctorFilterConfig} />
        </div>
      </div>
    </div>
  );
};

export default PatientDoctors;
