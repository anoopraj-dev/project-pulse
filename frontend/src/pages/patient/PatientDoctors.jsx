// import { useAsyncAction } from "../../hooks/useAsyncAction";
// import { getAllDoctors } from "../../api/patient/patientApis";
// import { useEffect, useState } from "react";
// import DoctorCard from "../../components/shared/components/DoctorCard";
// import toast from "react-hot-toast";
// import { Icon } from "@iconify/react";
// import { useNavigate } from "react-router-dom";
// import SearchInput from "../../components/shared/components/SearchInput";
// import { useSearch } from "../../hooks/useSearch";
// import ApplyFilters from "../../components/shared/components/ApplyFilters";
// import { doctorFilterConfig } from "../../components/shared/configs/FilterConfigs";
// import { fetchSearchSuggestions } from "../../api/user/userApis";
// import PageBanner from "@/components/shared/components/PageBanner";
// import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
// import { useUser } from "@/contexts/UserContext";
// import BlockedProfile from "@/components/shared/components/BlockedProfile";
// import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";

// const PatientDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const fetchDoctorsAction = useAsyncAction();
//   const navigate = useNavigate();
//   const [searchFilters, setSearchFilters] = useState({});
//   const { user } = useUser();

//   const {
//     query,
//     setQuery,
//     results,
//     loading: searchLoading,
//   } = useSearch({
//     type: "doctors",
//     role: "patient",
//   });

//   //---------------- Get all doctors --------------
//   const fetchAllDoctors = () => {
//     fetchDoctorsAction.executeAsyncFn(async () => {
//       try {
//         const res = await getAllDoctors();
//         if(res?.data?.success) setDoctors(res?.data?.users || []);
//       } catch (error) {
//         console.error(error);
//         toast.error(error?.response?.data?.message);
//       }
//     });
//   };

//   //------------------ Apply Filters --------------------
//   const applyAllFilters = (list, filters) => {
//     if (!filters || Object.keys(filters).length === 0) return list;

//     return list.filter((doc) =>
//       Object.keys(filters).every((key) => {
//         const filterValue = filters[key]?.toLowerCase().trim();
//         if (!filterValue) return true;

//         if (key === "specialization") {
//           const specs = doc?.professionalInfo?.specializations;
//           if (!specs) return false;

//           return Array.isArray(specs)
//             ? specs.some((s) => s.toLowerCase().includes(filterValue))
//             : specs.toLowerCase().includes(filterValue);
//         }

//         if (key === "location") {
//           return doc.location?.toLowerCase().includes(filterValue);
//         }

//         if (key === "feesRange") {
//           return Number(doc.fees) <= Number(filterValue);
//         }

//         return true;
//       }),
//     );
//   };

//   //--------------- Search Suggestions -------------
//   const fetchSuggestions = (query) => {
//     return fetchSearchSuggestions({
//       role: "patient",
//       query,
//       type: "doctors",
//     });
//   };

//   const handleSelectSuggestion = (item) => {
//     setQuery(item.name);
//   };

//   //------------ View Doctor Profile -------------

//   const handleProfileView = (id) => {
//     navigate(`/patient/doctor/${id}`);
//   };

//   useEffect(() => {
//     fetchAllDoctors();
//   }, []);

//   const approvedDoctors = doctors.filter((doc) => doc.status === "approved");
//   const searchedDoctors = query.trim().length > 0 ? results : approvedDoctors;
//   const visibleDoctors = applyAllFilters(searchedDoctors, searchFilters);
//   const isInitialLoading = fetchDoctorsAction.loading;

//   return (
//     <div className="min-h-screen ">
//       <PatientStatusBanner
//         status={user?.status}
//         blockedReason={user?.blockedReason}
//       />
//       {user?.status === "blocked" ? (
//         <>
//           <BlockedProfile reason={user?.blockedReason} />
//         </>
//       ) : (
//         <>
//           {/* Full-width Header Banner */}
//           <PageBanner
//             config={pageBannerConfig.patientDoctors}
//             activeTab="Available"
//             isLoading={isInitialLoading}
//             count={visibleDoctors.length}
//           />

//           {/* Content Area */}
//           <div className="mt-2 mx-auto px-4 pb-12 sm:px-6 lg:px-8">
//             {/* Search Bar */}
//             <div className="relative z-40 mb-8">
//               <SearchInput
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search doctors -name/specialization"
//                 fetchSuggestions={fetchSuggestions}
//                 onSelectSuggestion={handleSelectSuggestion}
//                 role="patient"
//                 entity="doctors"
//               />

//               {searchLoading && (
//                 <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
//                   <Icon icon="mdi:loading" className="animate-spin" />
//                   Searching…
//                 </div>
//               )}
//             </div>

//             {/* Filters + Grid */}
//             <div className="flex flex-col lg:flex-row gap-8 ">
//               {/* Right Sidebar: ApplyFilters */}
//               <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
//                 <ApplyFilters
//                   onApply={setSearchFilters}
//                   config={doctorFilterConfig}
//                 />
//               </div>

//               {/* Main Content: Doctors Grid */}
//               <div className="flex-1 lg:min-w-0">
//                 <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
//                   {visibleDoctors?.map((doc) => (
//                     <DoctorCard
//                       key={doc._id}
//                       doctor={doc}
//                       onView={() => handleProfileView(doc._id)}
//                     />
//                   ))}
//                 </div>

//                 {!isInitialLoading &&
//                   !searchLoading &&
//                   visibleDoctors?.length === 0 && (
//                     <div className="mt-20 flex flex-col items-center text-center text-slate-500">
//                       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
//                         <Icon
//                           icon="mdi:stethoscope"
//                           className="text-2xl text-slate-400"
//                         />
//                       </div>

//                       <h2 className="mt-4 text-base font-semibold text-slate-900">
//                         {query.trim()
//                           ? "No matching doctors found"
//                           : "No doctors available"}
//                       </h2>

//                       <p className="mt-1 max-w-sm text-sm text-slate-500">
//                         {query.trim()
//                           ? "Try searching with a different name or specialization."
//                           : "Approved doctors will appear here once they are added by the admin."}
//                       </p>
//                     </div>
//                   )}
//               </div>
//             </div>

//             {/* Mobile Filters */}
//             <div className="lg:hidden mt-8">
//               <ApplyFilters
//                 onApply={setSearchFilters}
//                 config={doctorFilterConfig}
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PatientDoctors;



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
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { useUser } from "@/contexts/UserContext";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const fetchDoctorsAction = useAsyncAction();
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({});
  const { user } = useUser();

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
        if (res?.data?.success) setDoctors(res?.data?.users || []);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
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
      type: "doctors",
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
    <div className="min-h-screen">
      {/* Status Banner */}
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />

      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <div className="flex flex-col">
          {/* Page Banner */}
          <PageBanner
            config={pageBannerConfig.patientDoctors}
            activeTab="Available"
            isLoading={isInitialLoading}
            count={visibleDoctors.length}
          />

          {/* Main Content Wrapper */}
          <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

            {/* Search Row */}
            <div className="relative z-40 mb-6">
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors by name or specialization…"
                fetchSuggestions={fetchSuggestions}
                onSelectSuggestion={handleSelectSuggestion}
                role="patient"
                entity="doctors"
              />

              {searchLoading && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 pl-1">
                  <Icon icon="mdi:loading" className="animate-spin text-sm" />
                  <span>Searching…</span>
                </div>
              )}
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* Sidebar Filters — Desktop */}
              <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                      Filters
                    </p>
                  </div>
                  <div className="p-4">
                    <ApplyFilters
                      onApply={setSearchFilters}
                      config={doctorFilterConfig}
                    />
                  </div>
                </div>
              </aside>

              {/* Doctors Grid */}
              <main className="flex-1 min-w-0">
                {isInitialLoading ? (
                  /* Skeleton Loader */
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-52 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse"
                      />
                    ))}
                  </div>
                ) : visibleDoctors.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleDoctors.map((doc) => (
                      <DoctorCard
                        key={doc._id}
                        doctor={doc}
                        onView={() => handleProfileView(doc._id)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 mb-4">
                      <Icon
                        icon="mdi:stethoscope"
                        className="text-3xl text-slate-300"
                      />
                    </div>
                    <h2 className="text-base font-semibold text-slate-800">
                      {query.trim()
                        ? "No matching doctors found"
                        : "No doctors available"}
                    </h2>
                    <p className="mt-1.5 max-w-xs text-sm text-slate-400 leading-relaxed">
                      {query.trim()
                        ? "Try a different name or specialization."
                        : "Approved doctors will appear here once added by the admin."}
                    </p>
                  </div>
                )}
              </main>
            </div>

            {/* Mobile Filters — below grid */}
            <div className="lg:hidden mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Filters
                </p>
              </div>
              <div className="p-4">
                <ApplyFilters
                  onApply={setSearchFilters}
                  config={doctorFilterConfig}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDoctors;