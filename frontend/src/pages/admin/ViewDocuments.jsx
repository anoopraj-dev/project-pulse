import { useState, useEffect } from "react";
import DocumentView from "../../components/user/doctor/documents/DocumentView";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { fetchDoctorById } from "../../api/admin/adminApis";
import DoctorDocumentsShimmer from "../../components/ui/loaders/DcotorDocumentsShimmer";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";


const ViewDocuments = () => {
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const fetchDoctorAction = useAsyncAction();
  const {id} = useParams();

  useEffect(() => {
  fetchDoctorAction.executeAsyncFn(async () => {
    try {
      const res = await fetchDoctorById(id);

      console.log("res from view docs", res);

      if (!res.success) {
        throw new Error("Failed to fetch documents");
      }

      setProfessionalInfo(res?.user?.professionalInfo);
    } catch (error) {
      toast.error("Something went wrong");
    }
  });
}, [id]);


  if (fetchDoctorAction.loading) {
    return <DoctorDocumentsShimmer />;
  }

  if (!professionalInfo) return null;

  return (
    <div >
      <DocumentView professionalInfo={professionalInfo} />
    </div>
  );
};

export default ViewDocuments;