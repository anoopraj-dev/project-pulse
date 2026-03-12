import React, { useEffect, useState } from "react";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { patientEditProfileConfig } from "../../components/forms/config/editPatientProfile";
import { fetchPatientProfile, updatePatientProfile } from "../../api/patient/patientApis";
import { replace, useNavigate } from "react-router-dom";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";


//----------- EDIT & UPDATE PROFILE ------------

const PatientEditProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  

 // -------- Prefill user data --------
  const getUser = async () => {
    try {
      const response = await fetchPatientProfile();
      const user = response.data.user;

      if(!user) return 
      setUser(user);
    } catch (error) {
      console.log(error)
    }
  };

  //------------ Update Profile ----------------
  const handleUpdateProfile =async (data) =>{
    try {
      const response = await updatePatientProfile(data);
      if(!response.data.success) return toast.error('Failed to update profile')
      navigate('/patient/profile');
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="min-h-screen pb-12">
      <PageBanner config={pageBannerConfig.patientEditProfile}/>

      <div className="px-8">
        <DynamicForm
        config={patientEditProfileConfig}
        onSubmit={handleUpdateProfile}
        mode="page"
        defaultValues={{}}
        values={user}
      />
      </div>
    </div>
  );
};

export default PatientEditProfile;
