import React from "react";
import { useEffect, useState } from "react";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";
import { useNavigate} from "react-router-dom";
import { fetchPatientProfile } from "../../api/patient/patientApis";
import {useModal} from '../../contexts/ModalContext'
import { UpdateProfilePictureModal } from "../../components/ui/modals/ModalInputs";
import ProfileView from "../../components/user/patient/profile/ProfileView";
import PatientStatusBanner from "../../components/user/patient/profile/PatientStatusBanner";
import BlockedProfile from "../../components/shared/components/BlockedProfile";

const PatientsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {openModal} = useModal();


  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await fetchPatientProfile();
      setUser(response?.data?.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //--------- Edit profile -------------
  const handleProfileEdit = () => {
    navigate('/patient/edit-profile');
  }

  //------------ Update Profile Picture --------------
  const handleUpdateProfilePicture = () => {
    openModal('Update your profile picture',UpdateProfilePictureModal)
  }

  useEffect(() => {
    fetchPatient();
  }, []);

  if (loading) return <div className="flex"> <ProfileShimmer/></div>;
  if (!user) return <div className="flex mt-18 text-7xl"> No user</div>

  return (
    <div className=" mt-18  flex flex-col items-center">
        <PatientStatusBanner status={user?.status} blockedReason={user?.blockedReason}/>
        {
          user?.status ==='blocked' && (<BlockedProfile reason={user?.blockedReason}/>)
        }
        {
          user?.status === 'active' && (<ProfileView user={user} onEdit={handleProfileEdit} onUpdateProfilePicture={handleUpdateProfilePicture}/>)
        }
      </div>
  );
};

export default PatientsProfile;
