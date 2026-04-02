import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPatientMedicalRecords } from "../../api/doctor/doctorApis";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { useImageModal } from "@/contexts/ImageModalContext";

const DoctorPatientRecords = () => {
  const { patientId } = useParams();
  const { openImage } = useImageModal();
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const res = await getPatientMedicalRecords(patientId);
      if (!res?.data?.success) {
        toast.error(res?.data?.message || "Failed to fetch records");
        return;
      }
      setRecords(res.data.records || []);
      setPatient(res.data.patient);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchRecords();
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ProfileShimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageBanner config={pageBannerConfig.doctorPatientRecords} activeTab="Records" count={records.length} />

      <div className="w-full px-4 pb-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 rounded-2xl bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 mb-4">
              <Icon
                icon="mdi:file-document-outline"
                className="text-2xl text-slate-600"
              />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No medical records found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              The patient has not uploaded any medical records yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {records.map((record) => (
              <div
                key={record._id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">
                    {record.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    {record.description || "No description provided"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Uploaded on: {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openImage(record.fileUrl, record.title)}
                    className="flex-1 text-center bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
                  >
                    View
                  </button>
                  <a
                    href={record.fileUrl}
                    download
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientRecords;