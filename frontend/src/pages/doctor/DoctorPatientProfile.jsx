import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { viewPatientProfile } from "../../api/doctor/doctorApis"; 
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileView from "../../components/user/patient/profile/ProfileView";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";

const DoctorPatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const viewProfileAction = useAsyncAction();
  const { id } = useParams();
  const navigate = useNavigate();

  const getPatientProfile = () => {
    viewProfileAction.executeAsyncFn(async () => {
      try {
        const res = await viewPatientProfile(id);

        if (!res?.data?.success) {
          return toast.error(
            res?.data?.message || "Failed to load patient profile",
          );
        }

        setPatient(res?.data?.user);
        setAppointments(res?.data?.appointments);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    });
  };

  const viewMedicalRecords = (id) =>{
    navigate(`/doctor/appointments/patient/records`)
  }

  useEffect(() => {
    if (id) getPatientProfile();
  }, [id]);

  const isLoading = viewProfileAction.loading;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col gap-4">
        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl bg-white px-4 py-6 sm:px-6">
            <ProfileShimmer />
          </div>
        )}

        {/* Profile */}
        {!isLoading && patient && (
          <div className="rounded-2xl bg-white px-4 py-6 sm:px-6">
            <ProfileView
              user={patient}
              viewer="doctor"
              appointments={appointments}
              onViewMedicalRecords={viewMedicalRecords}
            />
          </div>
        )}

        {/* Empty / Error */}
        {!isLoading && !patient && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 rounded-2xl bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 mb-4">
              <Icon
                icon="mdi:account-heart"
                className="text-2xl text-slate-600"
              />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Patient profile not found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              The requested patient profile could not be loaded. Try searching
              for another patient or contact support if you believe this is an
              error.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientProfile;