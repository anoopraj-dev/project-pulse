import React, { useState, useEffect } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { fetchDoctorProfile } from "../../api/doctor/doctorApis";
import { useParams } from "react-router-dom";
import ProfileView from "../../components/user/doctor/profile/ProfileView";
import ShimmerCard from "../../components/ui/loaders/ShimmerCard";
import DoctorStatusBanner from '../../components/user/doctor/profile/DoctorStatusBanner'
import { requestResubmission,resubmitProfile } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import { UpdateProfilePictureModal, CertificateUploadModal } from "../../components/ui/modals/ModalInputs";

const DoctorProfile = () => {
  const [user, setUser] = useState(null);
  const fetchDoctorAction = useAsyncAction();
  const { id } = useParams(); 
  const resubmissionRequestAction = useAsyncAction();
  const resubmissionAction = useAsyncAction()
  const navigate = useNavigate();
  const {openModal} = useModal();

  //-------------- FETCH DOCTOR --------------
  const fetchDoctor = async () => {
    try {
      await fetchDoctorAction.executeAsyncFn(async () => {
        const response = await fetchDoctorProfile(id); 
        setUser(response.data.user);
      });
    } catch (error) {
      console.log(error);
    }
  };

    //--------------- EDIT PROFILE ---------------

  const handleProfileEdit = () => {
    navigate("/doctor/edit-profile");
  };

  //--------------- UPLOAD PROFILE PICTURE ---------------
  
    const handleUpdateProfilePicture = () => {
      openModal("Update your profile picture", UpdateProfilePictureModal);
    };

  //--------------- UPLOAD CERTIFICATE ------------------

 const handleUploadCertificates = () => {
    openModal("Upload a certificate", CertificateUploadModal);
  };
  
  //-------------- REQUEST RESUBMISSION --------------

  const handleResubmissionRequest = async () => {
    try {
      await resubmissionRequestAction.executeAsyncFn(async () => {
        const res = await requestResubmission();
        if (!res.data.success) {
          return toast.error("Resubmission request failed!");
        }
        setUser(res.data.user)
        return toast.success("Resubmission request successful");
        
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  //-------------- RESUBMIT PROFILE -------------------
  const handleResubmission = async () => {
    try {
      await resubmissionAction.executeAsyncFn( async () => {
        const res = await resubmitProfile();
        if(!res.data.success){
          return toast.error('Profile resubmission failed')
        }
        setUser(res.data.user)
        return toast.success('Profile summitted successfully')
      })
    } catch (error) {
      console.log(error);
      return toast.error(error?.response?.data?.message)
    }
  }



  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (fetchDoctorAction.loading) return <ShimmerCard />;
  if (!user) return null;

  return (
    <div className="flex flex-col mt-18">
      <DoctorStatusBanner approvalStatus={user?.status} submissionCount={user?.submissionCount} variant="doctor"/>
      <ProfileView user={user} onResubmissionRequest={handleResubmissionRequest} onResubmission={handleResubmission} onEdit ={handleProfileEdit} onProfilePictureUpload={handleUpdateProfilePicture} onCerticateUpload={handleUploadCertificates}/> 
    </div>
  );
};

export default DoctorProfile;
