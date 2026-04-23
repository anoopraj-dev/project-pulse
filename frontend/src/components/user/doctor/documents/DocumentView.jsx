
import toast from "react-hot-toast";
import DocCard from "./DocCard";
import Thumbnail from "./Thumbnail";
import { useImageModal } from "../../../../contexts/ImageModalContext";
import { Icon } from "@iconify/react";

//-------- Card -----------------
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

const DocumentView = ({ professionalInfo, deleteDoc }) => {
  const { openImage } = useImageModal();

  const isImage = (url) => /\.(jpg|jpeg|png|webp)$/i.test(url);

  const viewDoc = (url, label) => openImage(url, label);

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
    <div className="min-h-screen dark:bg-gray-950">
      <div className="w-full px-4 py-6 pb-16 sm:px-6 lg:px-8 space-y-5">

        {/* ------- Medical License ------------ */}
        <Card>
          <CardHeader
            icon="mdi:card-account-details-outline"
            title="Medical License & Verification IDs"
            subtitle="Registration and council details"
          />
          <div className="p-5 space-y-5">

            {/* License info row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Registration Number", value: professionalInfo.medicalLicense?.registrationNumber },
                { label: "Medical Council",      value: professionalInfo.medicalLicense?.stateCouncil       },
                { label: "Year of Registration", value: professionalInfo.medicalLicense?.yearOfRegistration  },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 dark:border-gray-800 px-4 py-3 bg-slate-50 dark:bg-gray-800"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Proof documents */}
            {professionalInfo.medicalLicense?.proofDocument?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Proof Documents</p>
                <div className="flex flex-wrap gap-3">
                  {professionalInfo.medicalLicense.proofDocument.map((doc, idx) => (
                    <Thumbnail
                      key={idx}
                      url={doc}
                      isImage={isImage}
                      onView={() => viewDoc(doc, "Proof Document")}
                      onDownload={() => downloadDoc(doc)}
                      onDelete={() => deleteDoc(idx, "Proof Document")}
                      deletable={false}
                      small
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Info notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#0096C7]/20 bg-[#0096C7]/5 text-sm text-[#0077B6] dark:text-[#0096C7]">
              <Icon icon="mdi:information-outline" className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                To update your proof documents, go to your <strong>profile page</strong> and upload a new document.
                The new upload will automatically <strong>replace the existing one</strong>.
              </p>
            </div>
          </div>
        </Card>

        {/* ------- Education ------------ */}
        <Card>
          <CardHeader
            icon="mdi:school-outline"
            title="Education"
            subtitle="Degrees and certificates"
          />
          <div className="p-5">
            {professionalInfo.education?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {professionalInfo.education.map((edu) => (
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
            ) : (
              <div className="py-10 flex flex-col items-center text-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 mb-1">
                  <Icon icon="mdi:school-outline" className="text-xl text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">No education records</p>
                <p className="text-xs text-slate-400">Education entries will appear here once added.</p>
              </div>
            )}
          </div>
        </Card>

        {/* ------- Experience -----------*/}
        <Card>
          <CardHeader
            icon="mdi:briefcase-outline"
            title="Experience"
            subtitle="Hospital and clinical history"
          />
          <div className="p-5">
            {professionalInfo.experience?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {professionalInfo.experience.map((exp) => (
                  <DocCard
                    key={exp._id}
                    title={exp.hospitalName}
                    subtitle={exp.location}
                    meta={`${exp.years} year${exp.years !== 1 ? "s" : ""}`}
                    url={exp.experienceCertificate}
                    isImage={isImage}
                    onView={() => viewDoc(exp.experienceCertificate, "Certificate")}
                    onDownload={() => downloadDoc(exp.experienceCertificate)}
                    onDelete={() => deleteDoc(exp._id, "Certificate")}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center text-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 mb-1">
                  <Icon icon="mdi:briefcase-outline" className="text-xl text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">No experience records</p>
                <p className="text-xs text-slate-400">Experience entries will appear here once added.</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DocumentView;
