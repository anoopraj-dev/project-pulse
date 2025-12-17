import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headings from "../../components/Headings";
import { useModal } from "../../contexts/ModalContext";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import DynamicForm from "../../components/forms/engines/DynamicForm";
import { doctorOnboarding } from "../../components/forms/config/doctorOnboarding";

const DoctorOnboarding = () => {
  const stepKeys = Object.keys(doctorOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { dispatch } = useUser();


  // ----------- HANDLE NEXT REGISTRATION STEP ----------------

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
        } else if( typeof value === 'number'){
          formData.append(key, value.toString());
        } 
         else {
          // For normal strings, numbers, etc.
          formData.append(key, value);
        }
      });

      let response;
      if (currentStep === 0) {
        response = await api.post("/api/doctor/personal-info", formData);
      } else if (currentStep === 1) {
        response = await api.post("/api/doctor/professional-info", formData);
      } else if (currentStep === 2) {
        response = await api.post("/api/doctor/services-info", formData);
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
    } catch (error) {
      openModal("Something went wrong. Please try again.");
    }
  };

  // ----------- HANDLE FILE UPLOAD ----------------

    // const handleUpload = async (fieldName,fieldPath,index) => {
    //   console.log('handle upload called')
    //   console.log("fieldFiles:", fieldFiles);
    //   const selectedFiles = files[fieldName];
    //   if( !selectedFiles || !selectedFiles.length) return null;

    //   const uploaddedUrl = await uploadFile({
    //     file: selectedFiles[index ?? 0],
    //     fieldPath,
    //     userType:'doctor',
    //     index
    // });

    //   if(fieldPath === 'profilePicture' && uploaddedUrl) {
    //     dispatch({
    //       type: 'UPDATE_PROFILE_PICTURE',
    //       payload: uploaddedUrl
    //     })
    //   }

    //   return uploaddedUrl;
    // }

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

        {/* ------------Step Indicator --------------*/}
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

        {/*----------------- Dynamic------------------ Form */}
        <DynamicForm
          config={doctorOnboarding[stepKeys[currentStep]]}
          onSubmit={handleNext}
        />

      </div>
    </div>
  );
};

export default DoctorOnboarding;
