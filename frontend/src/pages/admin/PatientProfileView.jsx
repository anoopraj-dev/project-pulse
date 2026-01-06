import { useEffect, useState } from "react";
import ProfileView from "../../components/user/patient/profile/ProfileView";
import {
  fetchPatientById,
  blockPatientProfile,
  unblockPatientProfile,
} from "../../api/admin/adminApis";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PatientStatusBanner from "../../components/user/patient/profile/PatientStatusBanner";
import { useModal } from "../../contexts/ModalContext";
import { SendCommentModal } from "../../components/ui/modals/ModalInputs";

const PatientProfileView = () => {
  const [user, setUser] = useState(null);
  const fetchPatientAction = useAsyncAction();
  const unblockAction = useAsyncAction();
  const { id } = useParams();
  const { openModal } = useModal();

  const fetchPatient = () => {
    fetchPatientAction.executeAsyncFn(async () => {
      try {
        const res = await fetchPatientById(id);
        if (!res?.data?.success)
          return toast.error(
            error?.res?.data?.message || "Something went wrong"
          );
        setUser(res?.data?.user);
        toast.success(res?.data?.message || "Profile loaded");
      } catch (error) {
        console.log(error);
        toast.error(error.res.data.message);
      }
    });
  };

  const handleBlockProfile = (id) => {
    openModal("Are you sure you want to block this user?", SendCommentModal, {
      id,
      apiCall: blockPatientProfile,
      onSubmit: (updateUser) => setUser(updateUser),
    });
  };


  const handleUnblockProfile = (id) => {
  unblockAction.executeAsyncFn(async () => {
    try {
      const res = await unblockPatientProfile(id);

      if (!res?.data?.success) {
        return toast.error(
          res?.data?.message || "Something went wrong"
        );
      }

      console.log("API response:", res.data.user);
      setUser(res.data.user);
      toast.success(res.data.message || "User unblocked successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to unblock user"
      );
    }
  });
};


  useEffect(() => {
    fetchPatient();
  }, [id]);
  return (
    <div className="mt-18 min-h-screen">
      <PatientStatusBanner
        status={user?.status}
        variant="admin"
      />

      {user && (
        <ProfileView
          user={user}
          onBlock={() => handleBlockProfile(user?._id)}
          onUnblock={() => handleUnblockProfile(user?._id)}
        />
      )}
    </div>
  );
};

export default PatientProfileView;
