import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PageBanner from "@/components/shared/components/PageBanner";
import { useUser } from "@/contexts/UserContext";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import {
  fetchPatientRecords,
  uploadPatientRecord,
  deletePatientRecord,
} from "@/api/patient/patientApis";
import { useImageModal } from "@/contexts/ImageModalContext";

// ---------------- Shared Card Components ----------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-gray-800">
      <Icon icon={icon} className="text-slate-500 dark:text-slate-400 text-lg" />
    </div>
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const categoryMeta = {
  lab:          { icon: "mdi:flask-outline",         label: "Lab Report",   color: "bg-violet-50 text-violet-600 border-violet-100"  },
  imaging:      { icon: "mdi:radiology-box-outline", label: "Imaging",      color: "bg-blue-50 text-blue-600 border-blue-100"        },
  prescription: { icon: "mdi:pill",                  label: "Prescription", color: "bg-emerald-50 text-emerald-600 border-emerald-100"},
  other:        { icon: "mdi:file-outline",          label: "Other",        color: "bg-slate-50 text-slate-500 border-slate-200"     },
};

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "lab" });
  const [file, setFile] = useState(null);
  const { user } = useUser();
  const { openImage } = useImageModal();

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await fetchPatientRecords();
      if (!response?.data?.success) { toast.error(response?.data?.message || "Could not fetch records"); return; }
      setRecords(response.data.records || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload");
    if (!formData.title.trim()) return toast.error("Please enter record title");

    const payload = new FormData();
    payload.append("file", file);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);

    setSubmitting(true);
    try {
      const response = await uploadPatientRecord(payload);
      if (!response?.data?.success) { toast.error(response?.data?.message || "Upload failed"); return; }
      toast.success("Medical record added successfully");
      setFormData({ title: "", description: "", category: "lab" });
      setFile(null);
      await loadRecords();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (recordId) => {
    if (!recordId) return;
    try {
      const response = await deletePatientRecord(recordId);
      if (!response?.data?.success) return toast.error(response?.data?.message || "Delete failed");
      toast.success("Record deleted");
      setRecords((prev) => prev.filter((item) => item._id !== recordId));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not delete record");
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <PatientStatusBanner status={user?.status} blockedReason={user?.blockedReason} />

      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <>
          <PageBanner config={pageBannerConfig?.patientRecords} />

          <div className="w-full px-4 py-6 pb-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* ── LEFT COLUMN — Upload Form ── */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader
                    icon="mdi:cloud-upload-outline"
                    title="Upload Record"
                    subtitle="Add a new medical document"
                  />
                  <form className="p-5 space-y-3" onSubmit={handleUpload}>

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Title</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-700 px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:text-white placeholder-slate-300"
                        placeholder="e.g. Blood test report"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-700 px-3 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:text-white"
                      >
                        <option value="lab">Lab Report</option>
                        <option value="imaging">Imaging</option>
                        <option value="prescription">Prescription</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Description <span className="text-slate-300">(optional)</span></label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-700 px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:text-white placeholder-slate-300 resize-none"
                        placeholder="Optional notes about this record"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">File</label>
                      <label className="flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-gray-700 px-3 py-5 cursor-pointer hover:border-[#0096C7] hover:bg-slate-50 dark:hover:bg-gray-800 transition">
                        <Icon
                          icon={file ? "mdi:file-check-outline" : "mdi:upload-outline"}
                          className={`text-2xl ${file ? "text-[#0096C7]" : "text-slate-300"}`}
                        />
                        <span className="text-xs text-slate-400 text-center">
                          {file ? file.name : "Click to select a file"}
                        </span>
                        <span className="text-[10px] text-slate-300">PDF, DOC, or image</span>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 rounded-xl bg-[#0096C7] hover:bg-[#0077B6] active:scale-[0.99] text-white text-sm font-medium transition disabled:opacity-70 mt-1"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Icon icon="mdi:loading" className="animate-spin text-base" />
                          Uploading…
                        </span>
                      ) : (
                        "Upload Record"
                      )}
                    </button>
                  </form>
                </Card>
              </div>

              {/* ── RIGHT COLUMN — Records Grid ── */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-gray-800">
                        <Icon icon="mdi:folder-medical-outline" className="text-slate-500 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Your Records</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{records.length} document{records.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-44 rounded-xl bg-slate-50 border border-slate-100 animate-pulse" />
                        ))}
                      </div>
                    ) : records.length === 0 ? (
                      <div className="py-16 flex flex-col items-center text-center gap-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 mb-1">
                          <Icon icon="mdi:file-document-outline" className="text-2xl text-slate-400" />
                        </div>
                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">No records yet</h2>
                        <p className="text-sm text-slate-400 max-w-xs">
                          Upload medical records to keep everything in one place.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {records.map((record) => {
                          const meta = categoryMeta[record.category] || categoryMeta.other;
                          return (
                            <div
                              key={record._id}
                              className="flex flex-col justify-between rounded-xl border border-slate-100 dark:border-gray-800 p-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition"
                            >
                              {/* Top: category badge + title */}
                              <div className="mb-3">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide mb-2 ${meta.color}`}>
                                  <Icon icon={meta.icon} className="text-xs" />
                                  {meta.label}
                                </span>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{record.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{record.description || "No description"}</p>
                              </div>

                              {/* Bottom: date + actions */}
                              <div>
                                <p className="text-[10px] text-slate-300 mb-3">
                                  Uploaded {new Date(record.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openImage(record.fileUrl, record.title)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
                                  >
                                    <Icon icon="mdi:eye-outline" className="text-sm" />
                                    View
                                  </button>
                                  <a
                                    href={record.fileUrl}
                                    download
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-[#0096C7]/30 text-xs font-medium text-[#0096C7] hover:bg-[#0096C7]/5 transition"
                                  >
                                    <Icon icon="mdi:download-outline" className="text-sm" />
                                    Download
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(record._id)}
                                    className="flex items-center justify-center px-3 py-2 rounded-xl border border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                                  >
                                    <Icon icon="mdi:trash-can-outline" className="text-sm" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientRecords;