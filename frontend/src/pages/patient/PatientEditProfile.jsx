import React, { useEffect, useState } from "react";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { patientEditProfileConfig } from "../../components/forms/config/editProfile";
import { fetchPatientProfile, updatePatientProfile } from "../../api/patient/patientApis";
import { useNavigate } from "react-router-dom";

const PatientEditProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


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

  const handleUpdateProfile =async () =>{
    try {
      const response = await updatePatientProfile();
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
