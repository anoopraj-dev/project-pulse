import { useEffect, useState } from "react"
import { doctorEditProfileConfig } from "../../components/forms/config/editDoctorProfile"
import DynamicForm from "../../components/forms/engines/DynamicForm"
import { fetchDoctorProfile, updateDoctorProfile } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";
import { buildFormData } from "../../utilis/buildFormData";
import { useNavigate } from "react-router-dom";

// --------------- EDIT & UPDATE PROFILE -------------

const DoctorEditProfile = () => {
    const [user,setUser] = useState(null);
    const navigate = useNavigate();


    const normalizeDoctorData = (doctor) => {
  return {
    ...doctor,
    
    dob: doctor.dob
      ? new Date(doctor.dob).toISOString().split("T")[0]
      : "",
  };
};

    //---------- Prefill user data -------------
    const getUser = async() =>{
        try {
            const response = await fetchDoctorProfile();
            const doctor = response.data.user;
            if(!doctor) toast.error('Failed to fetch data') ;

            setUser(normalizeDoctorData(doctor))

        } catch (error) {
            console.log(error)
        }
    }

    //---------- Update Profile ----------------
    const handleUpdateProfile = async(data) =>{
        try {
          console.log('Update data',data)
          const formData = buildFormData(data);

            const response = await updateDoctorProfile(formData);
            if(!response.data.success) return toast.error('Error updating profile');

            navigate('/doctor/profile')
            
        } catch (error) {
            console.log(error);
             error.response?.data?.message || error.message || "Something went wrong"
        }
    }

    useEffect (()=>{
        getUser();
    },[])
  return (
    <div className="mt-18  flex flex-col items-center mb-18">
      <DynamicForm
        config={doctorEditProfileConfig}
        onSubmit={handleUpdateProfile}
        mode="page"
        defaultValues={{}}
        values={user}
      />
    </div>
  )
}

export default DoctorEditProfile