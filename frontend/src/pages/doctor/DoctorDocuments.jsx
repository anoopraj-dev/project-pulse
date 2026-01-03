import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchDoctorProfile } from "../../api/doctor/doctorApis";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import DoctorDocumentsShimmer from "../../components/ui/loaders/DcotorDocumentsShimmer";
import DocumentView from "../../components/user/doctor/documents/DocumentView";
import { useModal } from "../../contexts/ModalContext";
import { deleteDocuments } from "../../api/doctor/doctorApis";
import PrimaryButton from "../../components/shared/components/PrimaryButton";

// ------------------ Doctor Documents Page ---------------
const DoctorDocuments = () => {
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const { openModal, closeModal } = useModal();
  const deleteCertificateAction = useAsyncAction();
  const fetchDoctorAction = useAsyncAction();

  // ----------- Delete Document -----------------
  const deleteDoc = async (id, label) => {
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
          } catch (error) {
            console.log(error);
            toast.error("Certificate deletion failed");
          }

          closeModal();
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDoctorAction.executeAsyncFn(async () => {
      try {
        const res = await fetchDoctorProfile();

        if (!res.data.success) {
          throw new Error("Failed to fetch documents");
        }

        setProfessionalInfo(res.data.user.professionalInfo);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }, []);

  if (fetchDoctorAction.loading) {
    return <DoctorDocumentsShimmer />;
  }

  if (!professionalInfo) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <DocumentView professionalInfo={professionalInfo} deleteDoc={deleteDoc} />
    </div>
  );
};

export default DoctorDocuments;
