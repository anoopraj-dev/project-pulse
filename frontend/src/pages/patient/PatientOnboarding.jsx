import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headings from "../../components/shared/components/Headings";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import ShimmerCard from "../../components/ui/loaders/ShimmerCard";
import toast from "react-hot-toast";

import { patientOnboarding } from "../../components/forms/config/patientOnboarding";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useUser } from "../../contexts/UserContext";
import { useModal } from "../../contexts/ModalContext";
import { useFileUploadContext } from "../../contexts/FileUploadContext";

import {
  submitPatientPersonalInfo,
  submitPatientMedicalInfo,
  submitPatientLifestyleInfo,
} from "../../api/patient/patientApis";

// file fields used in patient onboarding
const FILE_FIELDS = ["profilePicture"];

const PatientOnboarding = () => {
  const stepKeys = Object.keys(patientOnboarding);
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const submitAction = useAsyncAction();

  const { email, id, isLoading } = useUser();
  const { openModal } = useModal();
  const { files, clearField } = useFileUploadContext();

  // ---------------- HANDLE NEXT STEP ----------------
  const handleNext = async (data) => {
    if (isLoading || !email || !id) {
      openModal("User data not loaded yet. Please wait.");
      return;
    }

    try {
      await submitAction.executeAsyncFn(async () => {
        const formData = new FormData();

        // TEXT FIELDS
        Object.entries(data).forEach(([key, value]) => {
          if (key === "profilePicture") return;
          if (value === null || value === undefined) return;

          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });

        console.log("files.profilePicture:", files.profilePicture);
console.log("instanceof File:", files.profilePicture instanceof File);


        // FILE FIELD
        if (files?.profilePicture) {
          formData.append("profilePicture", files.profilePicture);
        }

        // ---------- DEBUG ----------
        console.log("---- PATIENT FORM DATA ----");
        for (const [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? value.name : value);
        }

        // ---------- API CALL ----------
        let response;
        switch (currentStep) {
          case 0:
            response = await submitPatientPersonalInfo(formData);
            break;
          case 1:
            response = await submitPatientMedicalInfo(formData);
            break;
          case 2:
            response = await submitPatientLifestyleInfo(formData);
            break;
          default:
            return;
        }

        if (!response?.data?.success) {
          toast.error(response?.data?.message || "Submission failed");
          return;
        }

        toast.success(response.data.message);

        // ---------- CLEANUP ----------
        Object.keys(files).forEach(clearField);

        if (currentStep < stepKeys.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          navigate("/patient/profile");
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-10">
        <Headings text={patientOnboarding[stepKeys[currentStep]].title} />

        {/* -------- STEP INDICATOR -------- */}
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

        {/* -------- FORM -------- */}
        {isLoading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          <DynamicForm
            config={patientOnboarding[stepKeys[currentStep]]}
            onSubmit={handleNext}
            loading={submitAction.loading}
            mode="page"
          />
        )}
      </div>
    </div>
  );
};

export default PatientOnboarding;
