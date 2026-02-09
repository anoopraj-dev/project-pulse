import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import DoctorStatusTabs from "../../components/user/admin/doctors/DoctorStatusTabs";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { getAllDoctors } from "../../api/admin/adminApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/shared/components/DataTable";
import { doctorColumns } from "../../components/shared/configs/TableConfigs";
import SearchInput from "../../components/shared/components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import { fetchSearchSuggestions } from "../../api/user/userApis";

const ViewDoctors = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [doctors, setDoctors] = useState([]);
  const fetchAllDoctorsAction = useAsyncAction();
  const navigate = useNavigate();
  const { query, setQuery, results } = useSearch({
    role: "admin",
    type: "doctors",
  });

  //------------- Get All Doctors -------------
  const fetchAllDoctors = () => {
    fetchAllDoctorsAction.executeAsyncFn(async () => {
      try {
        const response = await getAllDoctors();

        if (!response?.success) {
          toast.error(response?.message || "Failed to load data");
          return;
        }

        setDoctors(response.users || []);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  //------------- Search Suggestions ---------------
  const fetchSuggestions = (query) =>{
    return fetchSearchSuggestions ({
      role: 'admin',
      query,
      type: 'doctor',
  
    })
  }

  const handleSelectSuggestions  = (item) => {
    setQuery(item.name)
  }
  // ------------- View Doctors ------------
  const handleView = (id) => {
    navigate(`/admin/doctor/${id}`);
  };

  const filteredDoctors = doctors?.filter((doc) => doc.status === activeTab);

  const searchedDoctors = results?.filter((doc) => doc.status === activeTab);

  const displayedDoctors = query.trim() ? searchedDoctors : filteredDoctors;
  const isLoading = fetchAllDoctorsAction.loading;

  return (
    <div className="min-h-screen">
      {/* ---------- Header band ---------- */}
      <div className="my-2">
        <div className="my-2 rounded-xl mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-sky-50 via-white to-cyan-100 pt-20 pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
            {/* Title */}
            <div className="">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                <Icon icon="mdi:shield-account" className="h-4 w-4" />
                Admin · Doctors
              </p>

              <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-4xl">
                Manage Doctors
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Review, approve, or reject doctors using a clear status-based
                management view.
              </p>
            </div>

            {/* Status + loading */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
                <Icon
                  icon={
                    activeTab === "approved"
                      ? "mdi:check-circle"
                      : activeTab === "pending"
                      ? "mdi:clock-outline"
                      : "mdi:close-circle"
                  }
                  className={
                    activeTab === "approved"
                      ? "text-emerald-500"
                      : activeTab === "pending"
                      ? "text-amber-500"
                      : "text-red-500"
                  }
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
                    className="h-4 w-4 animate-spin text-sky-500"
                  />
                  Loading doctors...
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <DoctorStatusTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors "
            fetchSuggestions={fetchSuggestions}
            onSelectSuggestion={handleSelectSuggestions}
            role= 'admin'
            entity='doctors'
          />
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Table header */}
          <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon icon="mdi:doctor" className="h-4 w-4 text-sky-600" />
                {activeTab === "approved"
                  ? "Approved doctors"
                  : activeTab === "pending"
                  ? "Pending approval"
                  : "Rejected doctors"}
              </h2>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <Icon icon="mdi:counter" className="h-4 w-4 text-slate-500" />
                <span className="font-semibold text-slate-900">
                  {filteredDoctors.length}
                </span>
                records
              </div>
            </div>
          </div>

          {/* Table / empty state */}
          <div className="px-2 py-3 sm:px-4">
            {filteredDoctors.length > 0 ? (
              <DataTable
                data={displayedDoctors}
                columns={doctorColumns}
                onView={handleView}

              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <Icon
                    icon="mdi:clipboard-text-outline"
                    className="h-6 w-6 text-slate-400"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No doctors in this state
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Switch tabs to review doctors in other approval states.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctors;
