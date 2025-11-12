import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../components/DynamicForm";
import { formSteps } from "../../formConfigs/formStepConfig";
import Headings from "../../components/Headings";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../api/api";
import { useModal } from "../../contexts/ModalContext";
import ShimmerCard from "../../components/ShimmerCard";

import toast from 'react-hot-toast'

const PatientRegistration = () => {
  const stepKeys = Object.keys(formSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const { email, id, isLoading } = useUser();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [loading,setLoading] = useState(false);


  const handleNext = async (data) => {
    if (isLoading || !email || !id) {
      openModal("User data not loaded yet. Please wait.");
      return;
    }

    setLoading(true);


    if (currentStep >= stepKeys.length) return;

    try {
      const formData = new FormData();
      const payload = { ...data }

      //send data to backend
      Object.entries(data).forEach(([key, value]) => {
        if (!Array.isArray(value)) {

          formData.append(key, value);
        }
      });

      formData.forEach((value, key) => {
        console.log(key, value);
      });


      if (currentStep === 0) {
        

        const response = await api.post("/api/patient/personal-info", formData);
        console.log("Step 0 response:", response.data);

        if (!response.data.success) {
          toast.error(response.data.message)
          return;
        }

        toast.success(response.data.message)
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1));



      } else if (currentStep === 1) {
        const response = await api.post("/api/patient/medical-info", payload);
        console.log("Step 1 response:", response.data);

        if (!response.data.success) {
          toast.error(response.data.message)
          return;
        }

        toast.success(response.data.message)
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1))

      }else if(currentStep ===2){

        const response = await api.post('/api/patient/lifestyle-info',payload)
        console.log('Step 2 response', response.data)

        if(!response.data.success){
          toast.error(response.data.message)
        }
        toast.success(response.data.message)
        setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1))
      }
       else if (currentStep === 3) {
        toast.success('User Information updated successfully')
        navigate('/patient/profile')
        
      }
      setLoading(false)
    } catch (error) {
      if (error.response) {
        console.log(error.response)
        toast.error(error.response.data.message || "Something went wrong on the server.");
      } else if (error.request) {
        toast.error("No response from the server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }finally{
      setLoading(false)
    }
  };


   const handleUpload = async(data) => {
    try {
      setLoading(true)
      if(!data.picture){
        toast.error('Please choose an image to upload!')
        return
      }
       const formData = new FormData();
        formData.append('profilePicture', data.picture[0])


      const response = await api.post('/api/patient/upload-picture',formData,{
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      })

      if(response.data.success){
        toast.success(response.data.message)
        return
      }else{
        toast.error(response.data.message)
        return
      }
    } catch (error) {
      toast.error('Failed to upload image')
    }finally{
      setLoading(false)
    }
  }


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

        {/* Step Indicator */}
        <div className="flex items-center justify-center my-6 space-x-6">
          {stepKeys.map((key, index) => (
            <div key={key} className="flex items-center">
              <div
                className={`rounded-full flex items-center justify-center w-12 h-12 ${currentStep === index
                    ? "bg-[#0096C7] text-white"
                    : "border border-[#0096C7]"
                  }`}
              >
                <span className="font-bold">{index + 1}</span>
              </div>
              {index < stepKeys.length - 1 && (
                <hr className="w-52 border border-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Form */}
        {isLoading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>

        ) : (
          <DynamicForm
            config={formSteps[stepKeys[currentStep]]}
            onSubmit={handleNext}
            loading={loading}
            handleUpload={handleUpload}
          />
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;
