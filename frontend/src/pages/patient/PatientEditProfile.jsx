import React, { useEffect, useState } from "react";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { patientEditProfileConfig } from "../../components/forms/config/editProfile";
import { fetchPatientProfile, updatePatientProfile } from "../../api/patient/patientApis";
import { replace, useNavigate } from "react-router-dom";


//----------- EDIT PROFILE ------------

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
      if(response.data.success) {
        navigate('/patient/profile');
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="mt-18  flex flex-col items-center mb-18">
      <DynamicForm
        config={patientEditProfileConfig}
        onSubmit={handleUpdateProfile}
        mode="page"
        defaultValues={{}}
        values={user}
      />
    </div>
  );
};

export default PatientEditProfile;
