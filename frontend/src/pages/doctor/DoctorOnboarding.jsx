import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headings from "../../components/shared/components/Headings";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { doctorOnboarding } from "../../components/forms/config/doctorOnboarding";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import toast from "react-hot-toast";
import { useModal } from "@/contexts/ModalContext";

import {
  submitDoctorPersonalInfo,
  submitDoctorProfessionalInfo,
  submitDoctorServicesInfo,
} from "../../api/doctor/doctorApis";

import { useFileUploadContext } from "../../contexts/FileUploadContext";
import { useUser } from "../../contexts/UserContext";
import ShimmerCard from "@/components/ui/loaders/ShimmerCard";

const FILE_FIELDS = [
  "profilePicture",
  "proofDocument",
  "experienceCertificate",
  "educationCertificate",
];

const DoctorOnboarding = () => {
  const stepKeys = Object.keys(doctorOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const submitAction = useAsyncAction();
  const { email, id, isLoading, dispatch } = useUser();
  const { openModal } = useModal();

  const { files, clearField } = useFileUploadContext();

  const handleNext = async (data) => {
    if (isLoading || !email || !id) {
      openModal("User data not loaded yet. Please wait.");
      return;
    }

    try {
      await submitAction.executeAsyncFn(async () => {
        const formData = new FormData();

        // ---------------- TEXT & NON-FILE FIELDS ----------------
        Object.entries(data).forEach(([key, value]) => {
          if (FILE_FIELDS.includes(key)) return;
          if (value === undefined || value === null) return;

          if (key === "services") return;

          // flatten repeatable fields JSON except file references
          if (Array.isArray(value)) {
            formData.append(
              key,
              JSON.stringify(
                value.map(
                  ({ experienceCertificate, educationCertificate, ...rest }) =>
                    rest,
                ),
              ),
            );
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });

        // ---------------- FILE FIELDS ----------------
        // Profile Picture
        if (files?.profilePicture) {
          formData.append("profilePicture", files.profilePicture);
        }

        // Proof Documents
        if (files?.proofDocument?.length > 0) {
          files.proofDocument.forEach((file) =>
            formData.append("proofDocument", file),
          );
        }

        // Experience Certificates
        data.experience?.forEach((_, index) => {
          const rhfKey = `experience[${index}].experienceCertificate`;
          const file = files[rhfKey];

          if (file) {
            formData.append("experienceCertificate", file);
          }
        });

        // Education Certificates
        data.education?.forEach((_, index) => {
          const rhfKey = `education[${index}].educationCertificate`;
          const file = files[rhfKey];

          if (file) {
            formData.append("educationCertificate", file);
          }
        });

        //services

        const services = [];

        if (data.online_fee) {
          services.push({
            serviceType: "online",
            fees: Number(data.online_fee),
            availableDates: [],
          });
        }

        if (data.offline_fee) {
          services.push({
            serviceType: "offline",
            fees: Number(data.offline_fee),
            availableDates: [],
          });
        }

        formData.append("services", JSON.stringify(services));

        // ---------------- API CALL ----------------
        let response;
        switch (currentStep) {
          case 0:
            response = await submitDoctorPersonalInfo(formData);

            if (response?.data?.data) {
              const updatedDoctor = response.data.data;

              dispatch({
                type: "SET_USER",
                payload: {
                  id: updatedDoctor._id,
                  name: updatedDoctor.name,
                  email: updatedDoctor.email,
                  role: "doctor",
                  profilePicture: updatedDoctor.profilePicture,
                  firstLogin: updatedDoctor.firstLogin,
                },
              });
            }

            break;
          case 1:
            response = await submitDoctorProfessionalInfo(formData);
            break;
          case 2:
            response = await submitDoctorServicesInfo(formData);
            const updatedDoctor = response.data.data;
            dispatch({
              type: "SET_USER",
              payload: {
                id: updatedDoctor._id,
                name: updatedDoctor.name,
                email: updatedDoctor.email,
                role: "doctor",
                profilePicture: updatedDoctor.profilePicture,
                firstLogin: updatedDoctor.firstLogin,
              },
            });

            break;
          default:
            return;
        }

        if (!response?.data?.success) {
          toast.error(response?.data?.message || "Submission failed");
          return;
        }

        toast.success(response.data.message);

        // ---------------- CLEANUP ----------------
        Object.keys(files).forEach(clearField);

        if (currentStep < stepKeys.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          navigate("/doctor/profile");
        }
      });
    } catch (error) {
      console.error(error);
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
        {isLoading ? (
          <div>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
        ) : (
          <DynamicForm
            config={doctorOnboarding[stepKeys[currentStep]]}
            onSubmit={handleNext}
            loading={submitAction.loading}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorOnboarding;
