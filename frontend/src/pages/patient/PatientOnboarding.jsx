
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientOnboarding } from "../../components/forms/config/patientOnboarding";
import Headings from "../../components/Headings";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../api/api";
import { useModal } from "../../contexts/ModalContext";
import ShimmerCard from "../../components/ShimmerCard";
import DynamicForm from '../../components/forms/engines/DynamicForm';

import toast from "react-hot-toast";

const PatientOnboarding = () => {
  const stepKeys = Object.keys(patientOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const { email, id, isLoading, dispatch } = useUser();
  const navigate = useNavigate();
  const { openModal } = useModal();
 

  // ----------- HANDLE NEXT REGISTRATION STEP ----------------
  const handleNext = async (data) => {
    if (isLoading || !email || !id) {
      openModal("User data not loaded yet. Please wait.");
      return;
    }

    if (currentStep >= stepKeys.length) return;

    try {
      const formData = new FormData();
      const payload = { ...data };
      Object.entries(data).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          formData.append(key, value);
        }
      });

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      //----------- API CALLS BASED ON CURRENT STEP ----------------

      if (currentStep === 0) {
        const response = await api.post("/api/patient/personal-info", formData);
        console.log("Step 0 response:", response.data);

        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        toast.success(response.data.message);
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1));
      } else if (currentStep === 1) {
        const response = await api.post("/api/patient/medical-info", payload);
        console.log("Step 1 response:", response.data);

        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        toast.success(response.data.message);
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1));
      } else if (currentStep === 2) {
        const response = await api.post("/api/patient/lifestyle-info", payload);
        console.log("Step 2 response", response.data);

        if (!response.data.success) {
          toast.error(response.data.message);
        }
        toast.success(response.data.message);
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1));
      } else if (currentStep === 3) {
        toast.success("User Information updated successfully");
        navigate("/patient/profile");
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        toast.error(
          error.response.data.message || "Something went wrong on the server."
        );
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your connection."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } 
  };

  // ----------- HANDLE IMAGE UPLOAD ----------------

  // const handleUpload = async (fileList, fieldPath, index) => {
  //   const imageUrl = await uploadFile(fileList, fieldPath, index);

  //     if (imageUrl) {
  //     dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: imageUrl });
  //   }
    
  //   return imageUrl;  
  // };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-10">
        <Headings
          text={
            currentStep === 0
              ? "Tell us about yourself"
              : "How are you keeping up"
          }
        />

        {/*-------------- Step Indicator-------------- */}
        <div className="flex items-center justify-center my-6 space-x-6">
          {stepKeys.map((key, index) => (
            <div key={key} className="flex items-center">
              <div
                className={`rounded-full flex items-center justify-center w-12 h-12 ${
                  currentStep === index
                    ? "bg-[#0096C7] text-white"
                    : "border border-[#0096C7]"
                }`}
              >
                <span className="font-bold">{index + 1}</span>
              </div>
              {index < stepKeys.length - 1 && (
                <hr className="w-4 sm:w-12 md:w-36 lg:w-52 border border-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/*------------- Dynamic Form -----------------*/}
        {isLoading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          <DynamicForm config={patientOnboarding[stepKeys[currentStep]]} onSubmit={handleNext}
        defaultValues={{}}
        mode="page"
       />
        )}
      </div>
    </div>
  );
};

export default PatientOnboarding;

