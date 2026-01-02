import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteDocuments,
  fetchDoctorProfile,
} from "../../api/doctor/doctorApis";

import Section from "../../components/user/doctor/documents/Section";
import Info from "../../components/user/doctor/documents/Info";
import DocCard from "../../components/user/doctor/documents/DocCard";
import Thumbnail from "../../components/user/doctor/documents/Thumbnail";
import { useImageModal } from "../../contexts/ImageModalContext";
import { useModal } from "../../contexts/ModalContext";
import PrimaryButton from "../../components/shared/components/PrimaryButton";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { Icon } from "@iconify/react";
import DoctorDocumentsShimmer from "../../components/ui/loaders/DcotorDocumentsShimmer";

// ------------------ Doctor Documents Page ---------------
const DoctorDocuments = () => {
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const { openImage } = useImageModal();
  const { openModal, closeModal } = useModal();
  const deleteCertificateAction = useAsyncAction();
  const fetchDoctorAction = useAsyncAction();

  useEffect(() => {
  fetchDoctorAction.executeAsyncFn(async () => {
    const res = await fetchDoctorProfile();

    if (!res.data.success) {
      throw new Error("Failed to fetch documents");
    }

    setProfessionalInfo(res.data.user.professionalInfo);
  }).catch(() => {
    toast.error("Something went wrong");
  });
}, []);

  if (fetchDoctorAction.loading) {
  return <DoctorDocumentsShimmer />;
}


  if (!professionalInfo) return null;

  const isImage = (url) => /\.(jpg|jpeg|png|webp)$/i.test(url);

  //------------- View Document ---------------------
  const viewDoc = (url, label) => {
    openImage(url, label);
  };

  //------------- Download Dcoument -------------
  const downloadDoc = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const mimeToExt = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "application/pdf": "pdf",
      };

      const ext = mimeToExt[blob.type] || "file";
      const filename = `document.${ext}`;

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  // ----------- Delete Document -----------------
  const deleteDoc = async (id,label) => {
    try {
      openModal(`Delete ${label}?`, PrimaryButton, {
        text: deleteCertificateAction.loading ? "Deleting..." : "Continue",
        disabled: deleteCertificateAction.loading,
        onClick: async () => {
          try {
            console.log("triggered deletion");
            await deleteCertificateAction.executeAsyncFn(async () => {
              const response = await deleteDocuments(id);

              if (response.data.success) {
                setProfessionalInfo(response?.data?.user?.professionalInfo);
                toast.success("Successfully removed document");
              } else {
                toast.error("Failed to remove document");
              }
            });
          } catch {
            toast.error("Certificate deletion failed");
          }

          closeModal();
        },
      });
    } catch {
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Welcome message */}
        <div className="text-center mb-12">
          <p className="text-slate-500 text-lg mt-1">
            Access all your professional documents below.
          </p>
        </div>

        {/* Medical License */}
        <Section
          title="Medical License & Verification IDs"
          icon="mdi:card-account-details"
        >
          
          <div className="flex gap-12 flex-col">
            <div className="space-y-4 flex gap-10 ">
              <Info
                label="Registration Number"
                value={professionalInfo.medicalLicense?.registrationNumber}
              />
              <Info
                label="Medical Council"
                value={professionalInfo.medicalLicense?.stateCouncil}
              />
              <Info
                label="Year of Registration"
                value={professionalInfo.medicalLicense?.yearOfRegistration}
              />
            </div>
            <div className="flex  flex-wrap gap-3 ">
              {professionalInfo.medicalLicense?.proofDocument?.map(
                (doc, idx) => (
                  <Thumbnail
                    key={idx}
                    url={doc}
                    isImage={isImage}
                    onView={() => viewDoc(doc, "Proof Document")}
                    onDownload={() => downloadDoc(doc)}
                    onDelete={() => deleteDoc( idx, "Proof Document")}
                    deletable={false}
                    small
                  />
                )
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 mb-3 text-sm text-blue-800 bg-blue-100 rounded-md border border-blue-200">
            <Icon
              icon="mdi:information-outline"
              className="w-5 h-5 flex-shrink-0"
            />
            <p>
              To update your proof documents, please go to your{" "}
              <strong>profile page</strong> and upload a new document. The new
              upload will automatically{" "}
              <strong>replace the existing document</strong>.
            </p>
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon="mdi:school-outline">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {professionalInfo.education?.map((edu) => (
              <DocCard
                key={edu._id}
                title={edu.degree}
                subtitle={edu.college}
                meta={`Completed ${edu.completionYear || "—"}`}
                url={edu.educationCertificate}
                isImage={isImage}
                onView={() => viewDoc(edu.educationCertificate, "Certificate")}
                onDownload={() => downloadDoc(edu.educationCertificate)}
                onDelete={() => deleteDoc(edu._id, "Certificate")}
              />
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" icon="mdi:briefcase-outline">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {professionalInfo.experience?.map((exp) => (
              <DocCard
                key={exp._id}
                title={exp.hospitalName}
                subtitle={exp.location}
                meta={`${exp.years} years`}
                url={exp.experienceCertificate}
                isImage={isImage}
                onView={() => viewDoc(exp.experienceCertificate, "Certificate")}
                onDownload={() => downloadDoc(exp.experienceCertificate)}
                onDelete={() => deleteDoc(exp._id, "Certificate")}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default DoctorDocuments;
