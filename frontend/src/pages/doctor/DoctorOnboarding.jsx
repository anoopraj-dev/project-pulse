import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headings from "../../components/shared/components/Headings";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { doctorOnboarding } from "../../components/forms/config/doctorOnboarding";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import toast from "react-hot-toast";

import {
  submitDoctorPersonalInfo,
  submitDoctorProfessionalInfo,
  submitDoctorServicesInfo,
} from "../../api/doctor/doctorApis";

import { buildFormData } from "../../utilis/buildFormData";

const DoctorOnboarding = () => {
  const stepKeys = Object.keys(doctorOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const submitAction = useAsyncAction();

  const handleNext = async (data) => {
    try {
      await submitAction.executeAsyncFn(async () => {
        const formData = buildFormData(data);

        let response;

        switch (currentStep) {
          case 0:
            response = await submitDoctorPersonalInfo(formData);
            break;
          case 1:
            response = await submitDoctorProfessionalInfo(formData);
            break;
          case 2:
            response = await submitDoctorServicesInfo(formData);
            break;
          default:
            return;
        }

        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        toast.success(response.data.message);

        if (currentStep < stepKeys.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          navigate("/doctor/profile");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
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
                <hr className="w-4 sm:w-12 md:w-36 lg:w-52 border border-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        <DynamicForm
          config={doctorOnboarding[stepKeys[currentStep]]}
          onSubmit={handleNext}
          loading={submitAction.loading}
        />
      </div>
    </div>
  );
};

export default DoctorOnboarding;
