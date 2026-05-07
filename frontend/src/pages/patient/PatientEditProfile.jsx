// import React, { useEffect, useState } from "react";
// import DynamicForm from "../../components/forms/engines/DynamicForm";
// import { patientEditProfileConfig } from "../../components/forms/config/editPatientProfile";
// import { fetchPatientProfile, updatePatientProfile } from "../../api/patient/patientApis";
// import { replace, useNavigate } from "react-router-dom";
// import PageBanner from "@/components/shared/components/PageBanner";
// import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";


// //----------- EDIT & UPDATE PROFILE ------------

// const PatientEditProfile = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

  

//  // -------- Prefill user data --------
//   const getUser = async () => {
//     try {
//       const response = await fetchPatientProfile();
//       const user = response.data.user;

//       if(!user) return 
//       setUser(user);
//     } catch (error) {
//       console.error(error)
//     }
//   };

//   //------------ Update Profile ----------------
//   const handleUpdateProfile =async (data) =>{
//     try {
//       const response = await updatePatientProfile(data);
//       if(!response.data.success) return toast.error('Failed to update profile')
//       navigate('/patient/profile');
      
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     getUser();
//   }, []);
//   return (
//     <div className="min-h-screen pb-6">
//       <PageBanner config={pageBannerConfig.patientEditProfile}/>

//       <div className="px-8">
//         <DynamicForm
//         config={patientEditProfileConfig}
//         onSubmit={handleUpdateProfile}
//         mode="page"
//         defaultValues={{}}
//         values={user}
//       />
//       </div>
//     </div>
//   );
// };

// export default PatientEditProfile;

import React, { useEffect, useState } from "react";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { patientEditProfileConfig } from "../../components/forms/config/editPatientProfile";
import {
  fetchPatientProfile,
  updatePatientProfile,
} from "../../api/patient/patientApis";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

      if (!user) return;

      setUser(user);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    }
  };

  //------------ Update Profile ----------------
  const handleUpdateProfile = async (data) => {
    try {
      const response = await updatePatientProfile(data);

      if (!response.data.success) {
        return toast.error("Failed to update profile");
      }

      toast.success("Profile updated successfully");

      navigate("/patient/profile");
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen pb-6">
      <PageBanner
        config={pageBannerConfig.patientEditProfile}
      />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-6">
            <DynamicForm
              config={patientEditProfileConfig}
              onSubmit={handleUpdateProfile}
              mode="page"
              defaultValues={{}}
              values={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEditProfile;