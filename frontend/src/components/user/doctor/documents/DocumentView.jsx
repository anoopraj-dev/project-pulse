import { useState } from "react";
import toast from "react-hot-toast";


import Section from "./Section";
import Info from "./Info";
import DocCard from "./DocCard";
import Thumbnail from "./Thumbnail";
import { useImageModal } from "../../../../contexts/ImageModalContext";
import { Icon } from "@iconify/react";

// ------------------ Doctor Documents Page ---------------
const DocumentView = ({professionalInfo,deleteDoc}) => {
  const { openImage } = useImageModal();
  const [isDocumentReview, setIsDocumentReview] = useState(false)
  
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




  return (
    <div className="min-h-screen ">
      <div className=" mx-auto space-y-10">
        {/* Welcome message */}

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

export default DocumentView;
