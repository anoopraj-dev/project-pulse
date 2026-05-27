import React from "react";
import { useEffect, useState } from "react";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";
import { useNavigate } from "react-router-dom";
import { fetchPatientProfile } from "../../api/patient/patientApis";
import { useModal } from "../../contexts/ModalContext";
import { UpdateProfilePictureModal } from "../../components/ui/modals/ModalInputs";
import ProfileView from "../../components/user/patient/profile/ProfileView";
import PatientStatusBanner from "../../components/user/patient/profile/PatientStatusBanner";
import BlockedProfile from "../../components/shared/components/BlockedProfile";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

const PatientsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { openModal } = useModal();

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await fetchPatientProfile();
      setUser(response?.data?.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT PROFILE ----------------
  const handleProfileEdit = () => {
    navigate("/patient/edit-profile");
  };

  // ---------------- UPDATE PROFILE PICTURE ----------------
  const handleUpdateProfilePicture = () => {
    openModal("Update your profile picture", UpdateProfilePictureModal);
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  if (loading) return <ProfileShimmer />;
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-500">
        No user found
      </div>
    );

  return (
    <>
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" && (
        <BlockedProfile reason={user?.blockedReason} />
      )}
      {user?.status !== "blocked" && (
        <>
          <PageBanner config={pageBannerConfig.patientProfile} activeTab='Overview'/>
          <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-6">
            <ProfileView
              user={user}
              onEdit={handleProfileEdit}
              onUpdateProfilePicture={handleUpdateProfilePicture}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PatientsProfile;
