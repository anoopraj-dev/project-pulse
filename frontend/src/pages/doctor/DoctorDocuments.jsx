import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteCertificates, fetchDoctorProfile } from "../../api/doctor/doctorApis";

import Section from "../../components/user/doctor/documents/Section";
import Info from "../../components/user/doctor/documents/Info";
import DocCard from "../../components/user/doctor/documents/DocCard";
import Thumbnail from "../../components/user/doctor/documents/Thumbnail";
import { useImageModal } from "../../contexts/ImageModalContext";
import { useModal } from "../../contexts/ModalContext";
import PrimaryButton from "../../components/shared/components/PrimaryButton";
import { useAsyncAction } from "../../hooks/useAsyncAction";



// ------------------ Doctor Documents Page ---------------
const DoctorDocuments = () => {
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const {openImage} = useImageModal();
  const {openModal, closeModal} = useModal();
  const deleteCertificateAction = useAsyncAction();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDoctorProfile();
        if (!res.data.success) {
          toast.error("Failed to fetch documents");
          return;
        }
        setProfessionalInfo(res.data.user.professionalInfo);
      } catch {
        toast.error("Something went wrong");
      }
    })();
  }, []);

  if (!professionalInfo) return null;

  const isImage = (url) => /\.(jpg|jpeg|png|webp)$/i.test(url);

  //------------- View Document ---------------------
 const viewDoc = (url,label) => {
    openImage(url,label)
  };


//------------- Download Dcoument -------------
  const downloadDoc = async(url)=>{
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const mimeToExt = {
        'image/jpeg': 'jpg',
        'image/png' : 'png',
        'image/webp': 'webp',
        'application/pdf': 'pdf'
      }

      const ext = mimeToExt[blob.type] || 'file';
      const filename = `document.${ext}`;

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(blobUrl);


    } catch (error) {
      toast.error('Download failed');
    }
  }

  // ----------- Delete Document -----------------
  const deleteDoc = async(docId,label) => {
    console.log('docId',docId)
    try {
      openModal(`Delete ${label}?`,PrimaryButton,{
      text:deleteCertificateAction.loading ? 'Deleting...' : 'Continue',
      disabled: deleteCertificateAction.loading,
      onclick: async () => {
        try{
          await deleteCertificateAction.executeAsyncFn( async () => {
            const response = await deleteCertificates(docId);
          })
        }catch{
          toast.error('Certificate deletion failed')
        }

        closeModal();
      }
    });
    } catch  {
      toast.error('Something went wrong')
    }
  }
  



  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Welcome message */}
        <div className="text-center mb-12">
          <p className="text-slate-500 text-lg mt-1">Access all your professional documents below.</p>
        </div>

        {/* Medical License */}
        <Section title="Medical License & Verification IDs" icon="mdi:card-account-details">
          <div className="flex gap-12 flex-col">
            <div className="space-y-4 flex gap-10 ">
              <Info label="Registration Number" value={professionalInfo.medicalLicense?.registrationNumber} />
              <Info label="Medical Council" value={professionalInfo.medicalLicense?.stateCouncil} />
              <Info label="Year of Registration" value={professionalInfo.medicalLicense?.yearOfRegistration} />
            </div>
            <div className="flex  flex-wrap gap-3 ">
              {professionalInfo.medicalLicense?.proofDocument?.map((doc, i) => (
                <Thumbnail
                  key={i}
                  url={doc}
                  isImage={isImage}
                  onView={() => viewDoc(doc,'Proof Document')}
                  onDownload={() => downloadDoc(doc)}
                  onDelete={() => deleteDoc(doc,"Proof Document")}
                  small
                />
              ))}
            </div>
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
                onView={() => viewDoc(edu.educationCertificate,'Certificate')}
                onDownload={() => downloadDoc(edu.educationCertificate)}
                onDelete={() => deleteDoc(edu.degree,'Certificate')}
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
                onView={() => viewDoc(exp.experienceCertificate,'Certificate')}
                onDownload={() => downloadDoc(exp.experienceCertificate)}
                onDelete={() => deleteDoc(exp.hospitalName,'Certificate')}
              />
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
};

export default DoctorDocuments;
