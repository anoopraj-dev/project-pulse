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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //--------- Edit profile -------------
  const handleProfileEdit = () => {
    navigate("/patient/edit-profile");
  };

  //------------ Update Profile Picture --------------
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
      {user?.status === "active" && (
        <>
          <div className=" my-2 bg-gradient-to-br from-sky-50 via-white to-cyan-100">
            <div className="px-2 sm:px-4 md:px-6 lg:px-20 xl:px-48 pb-6 pt-20 ">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                  Patient · Profile
                </p>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Patient Profile
                </h1>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  View and edit your details, vitals and health informations.
                </p>
              </div>
            </div>
          </div>

          <ProfileView
            user={user}
            onEdit={handleProfileEdit}
            onUpdateProfilePicture={handleUpdateProfilePicture}
          />
        </>
      )}
    </>
  );
};

export default PatientsProfile;
