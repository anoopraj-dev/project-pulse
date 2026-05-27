import { useEffect, useState } from "react";
import { doctorEditProfileConfig } from "../../components/forms/config/editDoctorProfile";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { fetchDoctorProfile, updateDoctorProfile } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";
import { buildFormData } from "../../utilis/buildFormData";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

const DoctorEditProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Normalize doctor data (for pre-filling form)
  const normalizeDoctorData = (doctor) => ({
    ...doctor,
    dob: doctor.dob ? new Date(doctor.dob).toISOString().split("T")[0] : "",
  });

  // Fetch doctor profile
  const getUser = async () => {
    try {
      const response = await fetchDoctorProfile();
      const doctor = response.data.user;
      if (!doctor) return toast.error("Failed to fetch data");

      setUser(normalizeDoctorData(doctor));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching doctor profile");
    }
  };

  // Update doctor profile
  const handleUpdateProfile = async (data) => {
    try {
      // Automatically stringify nested arrays/objects for qualifications & specializations
      if (data.qualifications) data.qualifications = JSON.stringify(data.qualifications);
      if (data.specializations) data.specializations = JSON.stringify(data.specializations);

      const formData = buildFormData(data);
      const response = await updateDoctorProfile(formData);
      if (!response.data.success) return toast.error("Error updating profile");

      toast.success("Profile updated successfully");
      navigate("/doctor/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen pb-6">
      <PageBanner config={pageBannerConfig.doctorEditProfile} />

      <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-6">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-6">
            <DynamicForm
              config={doctorEditProfileConfig}
              onSubmit={handleUpdateProfile}
              mode="page"
              values={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditProfile;
