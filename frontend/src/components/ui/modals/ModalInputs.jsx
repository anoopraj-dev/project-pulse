import { useState} from "react";
import {toast} from 'react-hot-toast'
import DynamicForm from "../../forms/engines/DynamicForm";
import { emailInputConfig, sendCommentConfig, setPasswordFormConfig, updateProfilePictureConfig } from "../../forms/config/modalFormConfig";
import { api } from "../../../api/axiosInstance";
import { certificateUploadConfig } from "../../forms/config/modalFormConfig";
import { rejectDoctorProfile, submitDoctorPersonalInfo,submitDoctorProfessionalInfo} from "../../../api/doctor/doctorApis";
import { submitPatientPersonalInfo } from "../../../api/patient/patientApis";
import { useUser } from "../../../contexts/UserContext";
import { useFileUploadContext } from "../../../contexts/FileUploadContext";
import { Icon } from "@iconify/react";
import { useAsyncAction } from "../../../hooks/useAsyncAction";


export const EmailModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const expiryTime = Date.now() + 60 * 1000;
      const payload = {...formData,type,expiryTime};

      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem('otpSession', JSON.stringify(payload));
      

      if (data.success) {
        toast.success(data.message || "Submitted successfully!");
        if (onSubmit) onSubmit(data); 
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again."
      );
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col">
      <DynamicForm config={emailInputConfig} onSubmit={handleSubmit}  mode='modal' loading={loading}/>
    </div>
  );
};


//----------------- set Password modal ---------------------

export const SetPasswordModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const payload = { ...formData, type };
      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem('forgotPasswordVerification', JSON.stringify(payload));

      if (data.success) {
        toast.success(data.message || "Password set successfully!");
        if (onSubmit) onSubmit(data);
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicForm mode="modal" config={setPasswordFormConfig} onSubmit={handleSubmit}  loading={loading}
    />
  );
};


//------------- Profile Picture upload ---------------
export const UpdateProfilePictureModal = ({ onSubmit, closeModal }) => {
  const { role } = useUser();
  const { files, clearField } = useFileUploadContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      // append file if it exists
      if (files?.profilePicture) {
        formData.append("profilePicture", files.profilePicture);
      } else {
        toast.error("Please select a file to upload");
        return;
      }

      let response;
      if (role === "patient") {
        response = await submitPatientPersonalInfo(formData);
      } else {
        response = await submitDoctorPersonalInfo(formData);
      }

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Upload failed");
        return;
      }

      toast.success(response.data.message || "Profile picture updated!");
      clearField("profilePicture"); // clear file input
      if (onSubmit) onSubmit(response.data);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicForm
      mode="modal"
      config={updateProfilePictureConfig}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};


// -------- Certificat upload modal --------------

export const CertificateUploadModal = ({ closeModal }) => {
  const { files, clearField } = useFileUploadContext();

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { certificateCategory, ...rest } = data;

      formData.append("mode", "append");

      // ---------------- EDUCATION ----------------
      if (certificateCategory === "Education") {
        formData.append(
          "education",
          JSON.stringify([
            {
              degree: rest.degree,
              college: rest.college,
              completionYear: rest.completionYear,
            },
          ])
        );

        if (files?.educationCertificate) {
          formData.append(
            "educationCertificate",
            files.educationCertificate
          );
        }
      }

      // ---------------- EXPERIENCE ----------------
      if (certificateCategory === "Experience") {
        formData.append(
          "experience",
          JSON.stringify([
            {
              years: rest.yearsOfExperience,
              hospital: rest.hospitalName,
              location: rest.hospitalLocation,
            },
          ])
        );

        if (files?.experienceCertificate) {
          formData.append(
            "experienceCertificate",
            files.experienceCertificate
          );
        }
      }

      // ---------------- ID PROOF ----------------
      if (certificateCategory === "ID Proof") {
        formData.append("registrationNumber", rest.registrationNumber);
        formData.append("stateCouncil", rest.stateCouncil);
        formData.append("yearOfRegistration", rest.yearOfRegistration);

        if (files?.proofDocument?.length > 0) {
          files.proofDocument.forEach((file) =>
            formData.append("proofDocument", file)
          );
        }
      }

      // -------- DEBUG --------
      console.log("---- CERTIFICATE FORM DATA ----");
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      // -------- API CALL --------
      const response = await submitDoctorProfessionalInfo(formData);

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Certificate upload failed");
        return;
      }

      toast.success("Certificate added successfully");

      // -------- CLEANUP --------
      Object.keys(files).forEach(clearField);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while uploading certificate");
    }
  };

  return (
    <DynamicForm
      mode="modal"
      config={certificateUploadConfig(closeModal)}
      onSubmit={handleSubmit}
    />
  );
};

//------------- Image Viewer -------------


 export const ImageModal = ({ url, label, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <span className="text-lg font-medium">{label}</span>
        <Icon
          icon="mingcute:close-circle-fill"
          className="w-7 h-7 cursor-pointer text-red-400 hover:text-red-500"
          onClick={onClose}
        />
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={url}
          alt="Preview"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

//----------------- Comment modal --------------
export const SendCommentModal = ({id,onSubmit,closeModal})=>{
  const rejectAction = useAsyncAction()
  const handleSubmit = async(data) =>{
    try {
      console.log(data)
      const formData =  new FormData();

      formData.append(
        'rejectionReason' , data.rejectionReason
      )

      //------------- API CALL ------------

      await rejectAction.executeAsyncFn(async ()=>{
        const res = await rejectDoctorProfile(id,formData);
        if(res.data.success){
          toast.success(res.data.message);
          if(onSubmit) onSubmit(res.data)
          closeModal();
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DynamicForm config={sendCommentConfig} mode='modal' onSubmit={handleSubmit}/>
  )
}

