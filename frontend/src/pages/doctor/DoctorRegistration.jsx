import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../components/DynamicForm";
import Headings from "../../components/Headings";
import { useModal } from "../../contexts/ModalContext";
import { api } from "../../api/api";
import { doctorStepsConfig } from "../../formConfigs/doctorStepsConfig";
import { useUser } from "../../contexts/UserContext";

const DoctorRegistration = () => {
  const stepKeys = Object.keys(doctorStepsConfig);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {email} = useUser();

const handleNext = async (data) => {
  try {
    const formData = new FormData();


    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
      
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (Array.isArray(value) || typeof value === "object") {
        // Convert arrays or objects to JSON strings
        formData.append(key, JSON.stringify(value));
      } else {
        // For normal strings, numbers, etc.
        formData.append(key, value);
      }
    });

   
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }


    let response;
    if (currentStep === 0) {
      response = await api.post("/api/doctor/personal-info", formData);
    } else if (currentStep === 1) {
      response = await api.post("/api/doctor/professional-info", formData);
    } else if (currentStep === 2) {
      response = await api.post("/api/doctor/services-info", formData);
    }

    if (!response.data.success) {
      openModal(response.data.message);
      return;
    }

    openModal(response.data.message);

    if (currentStep < stepKeys.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate("/doctor/dashboard");
    }
  } catch (error) {
    console.error("API error:", error);
    openModal("Something went wrong. Please try again.");
  }
};





  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-10">
        <Headings
          text={
            currentStep === 0
              ? "Tell us about yourself"
              : currentStep === 1
              ? "Professional Information"
              : "Services & Availability"
          }
        />

        {/* Step Indicator */}
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
                <hr className="w-96 border border-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Form */}
        <DynamicForm
          config={doctorStepsConfig[stepKeys[currentStep]]}
          onSubmit={handleNext}
        />

        {/* Navigation buttons */}
        {currentStep > 0 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRegistration;
