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

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "lab",
  });
  const [file, setFile] = useState(null);
  const { user } = useUser();
  const { openImage } = useImageModal();

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await fetchPatientRecords();
      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Could not fetch records");
        return;
      }
      setRecords(response.data.records || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

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
      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Upload failed");
        return;
      }

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
      if (!response?.data?.success) {
        return toast.error(response?.data?.message || "Delete failed");
      }
      toast.success("Record deleted");
      setRecords((prev) => prev.filter((item) => item._id !== recordId));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not delete record");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PatientStatusBanner status={user?.status} blockedReason={user?.blockedReason} />

      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <>
          <PageBanner config={pageBannerConfig?.patientRecords} />

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Upload medical record</h2>
              <form className="space-y-3" onSubmit={handleUpload}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-full"
                    placeholder="Title (e.g. Blood test report)"
                    required
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-full"
                  >
                    <option value="lab">Lab Report</option>
                    <option value="imaging">Imaging</option>
                    <option value="prescription">Prescription</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-full"
                    required
                  />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-full"
                  placeholder="Optional description"
                />

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-70"
                  >
                    {submitting ? "Uploading..." : "Upload Record"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Your records</h3>
              {loading ? (
                <div className="text-sm text-slate-500">Loading records...</div>
              ) : records.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Icon icon="mdi:file-document-outline" className="text-3xl mx-auto mb-3" />
                  <p className="font-medium">No records uploaded yet.</p>
                  <p className="text-sm">Upload medical records to keep everything in your history.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {records.map((record) => (
                    <div key={record._id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                      <div className="text-xs uppercase text-slate-500 font-semibold mb-1">{record.category || "Other"}</div>
                      <div className="font-semibold text-slate-900 mb-2 truncate">{record.title}</div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{record.description || "No description"}</p>
                      <p className="text-xs text-slate-400 mb-3">Uploaded on: {new Date(record.createdAt).toLocaleDateString()}</p>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => openImage(record.fileUrl, record.title)}
                          className="py-1 text-center rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          View
                        </button>
                        <a
                          href={record.fileUrl}
                          download
                          className="py-1 text-center rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemove(record._id)}
                          className="py-1 text-center rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientRecords;
