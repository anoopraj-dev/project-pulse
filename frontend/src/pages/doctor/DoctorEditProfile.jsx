import { useEffect, useState } from "react";
import { doctorEditProfileConfig } from "../../components/forms/config/editDoctorProfile";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { fetchDoctorProfile, updateDoctorProfile } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";
import { buildFormData } from "../../utilis/buildFormData";
import { useNavigate } from "react-router-dom";

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
      console.log(error);
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

      formData.forEach((key,val)=>{
        console.log(val,key)
      })

      const response = await updateDoctorProfile(formData);
      if (!response.data.success) return toast.error("Error updating profile");

      toast.success("Profile updated successfully");
      navigate("/doctor/profile");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="mt-18 flex flex-col items-center mb-18">
      <DynamicForm
        config={doctorEditProfileConfig}
        onSubmit={handleUpdateProfile}
        mode="page"
        values={user}
      />
    </div>
  );
};

export default DoctorEditProfile;
