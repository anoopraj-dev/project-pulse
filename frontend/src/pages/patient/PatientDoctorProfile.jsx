import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { viewDoctorProfile } from "../../api/patient/patientApis";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileView from "../../components/user/doctor/profile/ProfileView";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";

const PatientDoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [availability,setAvailability] = useState([])
  const viewProfileAction = useAsyncAction();
  const { id } = useParams();

  const getDoctorProfile = () => {
    viewProfileAction.executeAsyncFn(async () => {
      try {
        const res = await viewDoctorProfile(id);

        if (!res?.data?.success) {
          return toast.error(
            res?.data?.message || "Failed to load doctor profile"
          );
        }

        setDoctor(res?.data?.user);
        setAvailability(res?.data?.availability)
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Something went wrong"
        );
      }
    });
  };

  useEffect(() => {
    if (id) getDoctorProfile();
  }, [id]);

  const isLoading = viewProfileAction.loading;

  return (
    <div className="min-h-screen bg-slate-50">
   
      {/* Content */}
      {/* <div className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 lg:px-8"> */}
        <div className="flex flex-col gap-4">
          {/* Loading */}
          {isLoading && (
            <div className="rounded-2xl bg-white px-4 py-6 sm:px-6">
              <ProfileShimmer />
            </div>
          )}

          {/* Profile */}
          {!isLoading && doctor && (
            <div className="rounded-2xl bg-white px-4 py-6 sm:px-6">
              <ProfileView user={doctor} viewer='patient' availability={availability}/>
            </div>
          )}

          {/* Empty / Error */}
          {!isLoading && !doctor && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 rounded-2xl bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 mb-4">
                <Icon
                  icon="mdi:stethoscope"
                  className="text-2xl text-slate-600"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Doctor profile not found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                The requested doctor profile could not be loaded. Try searching for
                another doctor or contact support if you believe this is an error.
              </p>
            </div>
          )}
        </div>
      </div>
   
  );
};

export default PatientDoctorProfile;
