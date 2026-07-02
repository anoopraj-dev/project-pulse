import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PageBanner from "@/components/shared/components/PageBanner";
import { useUser } from "@/contexts/UserContext";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { fetchPatientPrescriptions } from "@/api/patient/patientApis";
import { getConsultationPDF } from "@/api/user/userApis";
import Skeleton from "@/components/ui/loaders/Skeleton";
import Pagination from "@/components/shared/components/Pagination";

// ---------------- SHARED CARD COMPONENTS ----------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetchPatientPrescriptions();
      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Could not fetch prescriptions");
        return;
      }
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong fetching prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleDownloadPDF = async (consultationId) => {
    if (!consultationId) return;
    setDownloadingId(consultationId);
    const toastId = toast.loading("Generating prescription PDF...");
    try {
      const res = await getConsultationPDF(consultationId, "patient");
      const url = window.URL.createObjectURL(res.data);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${consultationId.slice(-6)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss(toastId);
      toast.success("Prescription downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error loading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewPDF = async (consultationId) => {
    if (!consultationId) return;
    const toastId = toast.loading("Generating prescription PDF...");
    try {
      const res = await getConsultationPDF(consultationId, "patient");
      const url = window.URL.createObjectURL(res.data);
      toast.dismiss(toastId);
      window.open(url, "_blank");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error loading PDF:", error);
      toast.error("Failed to load PDF");
    }
  };

  // Filter prescriptions by doctor name, medicine name or diagnosis
  const filteredPrescriptions = prescriptions.filter((p) => {
    const doctorName = p.doctor?.name?.toLowerCase() || "";
    const diagnosis = p.diagnosis?.toLowerCase() || "";
    const medicinesMatch = p.medicines?.some((m) =>
      m.medicine?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      doctorName.includes(searchQuery.toLowerCase()) ||
      diagnosis.includes(searchQuery.toLowerCase()) ||
      medicinesMatch
    );
  });

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const displayedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-slate-50/50">
      <PatientStatusBanner status={user?.status} blockedReason={user?.blockedReason} />

      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <>
          <PageBanner config={pageBannerConfig?.patientPrescriptions} />

          <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-12">
            {/* Search and Filters Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="relative w-full sm:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:magnify" className="text-slate-400 text-lg" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by doctor, medicine name or diagnosis..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:text-white placeholder-slate-400"
                />
              </div>
              <div className="text-xs font-semibold text-slate-400">
                Showing {filteredPrescriptions.length} of {prescriptions.length} Prescription{prescriptions.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Prescriptions Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white border border-slate-100 dark:border-gray-800 animate-pulse p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-gray-800" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-slate-200 dark:bg-gray-800 rounded" />
                        <div className="h-3 w-1/4 bg-slate-200 dark:bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-200 dark:bg-gray-800 rounded" />
                      <div className="h-3 w-5/6 bg-slate-200 dark:bg-gray-800 rounded" />
                    </div>
                    <div className="h-10 w-full bg-slate-200 dark:bg-gray-800 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-gray-800 mb-2 shadow-sm ring-1 ring-slate-100 dark:ring-gray-700">
                  <Icon icon="mdi:pill-off" className="text-3xl text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">No prescriptions found</h2>
                <p className="text-sm text-slate-400 max-w-sm">
                  {searchQuery ? "No prescriptions match your search criteria. Try typing something else." : "You don't have any digital prescriptions on record yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedPrescriptions.map((prescription) => {
                  const createdDate = new Date(prescription.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <Card key={prescription._id} className="flex flex-col justify-between">
                      <div>
                        {/* Card Header: Doctor info + Date */}
                        <div className="p-5 border-b border-slate-100 dark:border-gray-800/80 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 rounded-xl ring-2 ring-slate-100 dark:ring-gray-800 overflow-hidden bg-slate-50 dark:bg-gray-800 flex-shrink-0">
                              {prescription.doctor?.profilePicture ? (
                                <img
                                  src={prescription.doctor.profilePicture}
                                  alt={prescription.doctor.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                  {prescription.doctor?.name?.charAt(0)?.toUpperCase() || "D"}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                Dr. {prescription.doctor?.name}
                              </h3>
                              <p className="text-xs text-slate-400 truncate">
                                {prescription.doctor?.professionalInfo?.specializations?.[0] || "Specialist"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-semibold text-slate-400">{createdDate}</p>
                            <span className="inline-flex mt-1 items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-500 border border-slate-200 dark:border-gray-700 uppercase tracking-wide">
                              #{prescription._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Card Body: Diagnosis + Medicines */}
                        <div className="p-5 space-y-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis</span>
                            <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 text-[#0096C7] dark:text-[#38bdf8] border border-blue-100/50 dark:border-blue-900/30 text-xs font-semibold">
                              <Icon icon="mdi:clipboard-text-play-outline" className="text-sm" />
                              {prescription.diagnosis}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescribed Medicines</span>
                            <div className="grid grid-cols-1 gap-2.5">
                              {prescription.medicines?.map((med, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-gray-800/40 rounded-xl border border-slate-100/80 dark:border-gray-800/60"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                      <Icon icon="mdi:pill" className="text-sm" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{med.medicine}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                      {med.dosage}
                                    </span>
                                    {med.timesPerDay && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/25 uppercase tracking-wide">
                                        {med.timesPerDay}x/day
                                      </span>
                                    )}
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${
                                      med.timing === "before" 
                                        ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/25" 
                                        : "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/25"
                                    }`}>
                                      {med.timing} Meal
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: PDF Actions */}
                      <div className="px-5 pb-5 pt-3 bg-slate-50/40 dark:bg-gray-900/20 border-t border-slate-50 dark:border-gray-800/50 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleViewPDF(prescription.consultation)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
                        >
                          <Icon icon="mdi:eye-outline" className="text-sm" />
                          View PDF
                        </button>
                        <button
                          type="button"
                          disabled={downloadingId === prescription.consultation}
                          onClick={() => handleDownloadPDF(prescription.consultation)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#0096C7]/30 dark:border-[#0096C7]/20 text-xs font-bold text-[#0096C7] dark:text-[#38bdf8] hover:bg-[#0096C7]/5 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {downloadingId === prescription.consultation ? (
                            <>
                              <Icon icon="mdi:loading" className="animate-spin text-sm" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Icon icon="mdi:download-outline" className="text-sm" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientPrescriptions;
