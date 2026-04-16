import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import DynamicForm from "../../forms/engines/DynamicForm";
import { setAppointmentStatus } from "../../../api/user/userApis";
import {
  emailInputConfig,
  revokeStatusConfig,
  sendCommentConfig,
  setAppointmentStatusConfig,
  setPasswordFormConfig,
  updateProfilePictureConfig,
} from "../../forms/config/modalFormConfig";
import { api } from "../../../api/axiosInstance";
import { certificateUploadConfig } from "../../forms/config/modalFormConfig";
import {
  submitDoctorPersonalInfo,
  submitDoctorProfessionalInfo,
} from "../../../api/doctor/doctorApis";
import { endConsultation, submitPatientPersonalInfo } from "../../../api/patient/patientApis";
import { useUser } from "../../../contexts/UserContext";
import { useFileUploadContext } from "../../../contexts/FileUploadContext";
import { Icon } from "@iconify/react";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import { revokeProfileStatus } from "../../../api/admin/adminApis";
import { uploadFileService } from "@/api/fileUpload/fileUploadService";

//-------------- Email & role modal --------------------
export const EmailModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const expiryTime = Date.now() + 60 * 1000;
      const payload = { ...formData, type, expiryTime };

      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem("otpSession", JSON.stringify(payload));

      if (data.success) {
        toast.success(data.message || "Submitted successfully!");
        if (onSubmit) onSubmit(data);
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <DynamicForm
        config={emailInputConfig}
        onSubmit={handleSubmit}
        mode="modal"
        loading={loading}
      />
    </div>
  );
};

//----------------- set Password modal ---------------------

export const SetPasswordModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    const { newPassword, confirmPassword } = formData;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be atleast 8 characters and include a letter, number and symbol",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    }
    try {
      setLoading(true);
      const payload = { ...formData, type };

      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem(
        "forgotPasswordVerification",
        JSON.stringify(payload),
      );

      if (data.success) {
        toast.success(data.message || "Password set successfully!");
        if (onSubmit) onSubmit(data);
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicForm
      mode="modal"
      config={setPasswordFormConfig}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

//------------- Profile Picture upload ---------------
export const UpdateProfilePictureModal = ({ onSubmit, closeModal }) => {
  const { role, dispatch } = useUser();
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

      // let response;
      // if (role === "patient") {
      //   response = await submitPatientPersonalInfo(formData);
      // } else {
      //   response = await submitDoctorPersonalInfo(formData);
      // }

      const response = await uploadFileService({
        file: files.profilePicture,
        fieldPath: "profilePicture",
        userType: role,
      });

      console.log(response);

      if (!response?.success) {
        toast.error(response?.message || "Upload failed");
        return;
      }

      toast.success(response.message || "Profile picture updated!");
      clearField("profilePicture"); // clear file input
      if (onSubmit) onSubmit(response.user);
      dispatch({ type: "SET_USER", payload: response.user });
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
  const uploadCertificateAction = useAsyncAction();

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
          ]),
        );

        if (files?.educationCertificate) {
          formData.append("educationCertificate", files.educationCertificate);
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
          ]),
        );

        if (files?.experienceCertificate) {
          formData.append("experienceCertificate", files.experienceCertificate);
        }
      }

      // ---------------- ID PROOF ----------------
      if (certificateCategory === "ID Proof") {
        formData.append("registrationNumber", rest.registrationNumber);
        formData.append("stateCouncil", rest.stateCouncil);
        formData.append("yearOfRegistration", rest.yearOfRegistration);

        if (files?.proofDocument?.length > 0) {
          files.proofDocument.forEach((file) =>
            formData.append("proofDocument", file),
          );
        }
      }

      // -------- API CALL --------
      uploadCertificateAction.executeAsyncFn(async () => {
        const response = await submitDoctorProfessionalInfo(formData);

        if (!response?.data?.success) {
          toast.error(response?.data?.message || "Certificate upload failed");
          return;
        }
        toast.success("Certificate added successfully");

        // -------- CLEANUP --------
        Object.keys(files).forEach(clearField);
        closeModal();
      });
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
      loading={uploadCertificateAction.loading}
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
        {url.endsWith(".pdf") ? (
          <object data={url} type="application/pdf" className="w-full h-full">
            <p className="text-white">PDF preview not available</p>
          </object>
        ) : (
          <img
            src={url}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

//----------------- Comment modal --------------
export const SendCommentModal = ({ id, onSubmit, closeModal, apiCall }) => {
  const apiAction = useAsyncAction();
  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("reason", data.reason);

      //------------- API CALL ------------

      await apiAction.executeAsyncFn(async () => {
        const res = await apiCall(id, formData);
        if (res.data.success) {
          toast.success(res.data.message);
          if (onSubmit) onSubmit(res.data.user);
          closeModal();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DynamicForm
      config={sendCommentConfig}
      mode="modal"
      onSubmit={handleSubmit}
      loading={apiAction.loading}
    />
  );
};

// -------------------- Revoke Status -----------------

export const RevokeStatusModal = ({ id, onSubmit, closeModal }) => {
  const apiAction = useAsyncAction();

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("status", data.status);

      await apiAction.executeAsyncFn(async () => {
        const res = await revokeProfileStatus(id, formData);

        if (res?.data?.success) {
          toast.success(res.data.message);

          if (onSubmit) onSubmit(res.data.user);
          closeModal();
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <DynamicForm
      config={revokeStatusConfig}
      mode="modal"
      onSubmit={handleSubmit}
      loading={apiAction.loading}
    />
  );
};

//---------------- Appointments action ------------------
export const AppointmentsActionModal = ({
  appointment,
  id,
  role,
  onSubmit,
  closeModal,
}) => {
  const apiAction = useAsyncAction();

  //---------------- Allowed action time ---------------
  const isActionAllowed = useMemo(() => {
    if (!appointment?.appointmentDate || !appointment?.timeSlot) return false;

    const datePart = new Date(appointment.appointmentDate)
      .toISOString()
      .split("T")[0];

    const appointmentDateTime = new Date(
      `${datePart}T${appointment.timeSlot}:00`,
    );
    const now = new Date();

    const diffInHours =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Admin can override 24h restriction if needed
    return role === "admin" ? true : diffInHours >= 24;
  }, [appointment, role]);

  const formConfig = {
    ...setAppointmentStatusConfig,
    fields: setAppointmentStatusConfig.fields.map((field) => {
      if (field.name === "appointmentStatus") {
        // Determine available actions by role
        let options = [];

        if (role === "doctor") {
          options = ["confirm", "cancel", "re-schedule"];
          // Only restrict actions if within 24h
          if (!isActionAllowed) options = [];
        } else if (role === "patient") {
          options = ["cancel"];
          if (!isActionAllowed) options = [];
        } else if (role === "admin") {
          // Admin has all actions, no 24h restriction
          options = ["confirm", "cancel", "re-schedule", "complete"];
        }

        return { ...field, options };
      }
      return field;
    }),
  };

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("status", data.appointmentStatus);

      await apiAction.executeAsyncFn(async () => {
        const res = await setAppointmentStatus(id, role, formData);
        if (res?.data?.success) {
          toast.success("Appointment status updated");
          onSubmit && onSubmit();
          closeModal && closeModal();
        } else {
          toast.error("Failed to update appointment status");
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update appointment status");
    }
  };

  if (!appointment)
    return (
      <p className="text-sm text-red-500">Appointment details not available</p>
    );

  return (
    <div>
      {/* Appointment Details */}
      <div className="mb-4 rounded-md border border-slate-200 p-4 text-sm text-slate-700">
        {/* Show both patient and doctor info for admin */}
        {role === "admin" && (
          <>
            <p>
              <strong>Patient:</strong> {appointment.patient?.name || "N/A"}
            </p>
            <p>
              <strong>Doctor:</strong> {appointment.doctor?.name || "N/A"}
            </p>
            <p>
              <strong>Specialization:</strong>{" "}
              {appointment.doctor?.professionalInfo?.specializations[0] ||
                "N/A"}
            </p>
          </>
        )}

        {role === "doctor" && (
          <>
            <p>
              <strong>Patient:</strong> {appointment.patient?.name}
            </p>
            <p>
              <strong>Gender:</strong> {appointment.patient?.gender || "N/A"}
            </p>
          </>
        )}

        {role === "patient" && (
          <>
            <p>
              <strong>Doctor:</strong> {appointment.doctor?.name || "N/A"}
            </p>
            <p>
              <strong>Specialization:</strong>{" "}
              {appointment.doctor?.professionalInfo?.specializations[0] ||
                "N/A"}
            </p>
          </>
        )}

        <p>
          <strong>Consultation:</strong> {appointment?.serviceType || "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(appointment.appointmentDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {appointment.timeSlot || "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{appointment.status}</span>
        </p>

        {appointment.reason && (
          <p>
            <strong>Reason:</strong> {appointment.reason}
          </p>
        )}

        {appointment.notes && (
          <p>
            <strong>Notes:</strong> {appointment.notes}
          </p>
        )}
      </div>

      {/* Status Form */}
      {!isActionAllowed && role !== "admin" ? (
        <p className="text-red-500 font-medium text-sm">
          Changes are not allowed within 24 hours.
        </p>
      ) : (
        <DynamicForm
          config={formConfig}
          mode="modal"
          onSubmit={handleSubmit}
          loading={apiAction.loading}
        />
      )}
    </div>
  );
};





// const EndConsultationModal = ({ consultationId, closeModal }) => {
  
//   console.log('modal consultationid',consultationId)
//   const [step, setStep] = useState("confirm"); 
//   // confirm | review
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ----------------  USER SAYS "NO REVIEW NEEDED" ----------------
//   const handleYesContinue = () => {
//     closeModal(); // stay in call
//   };

//   // ---------------- USER CHOOSES TO END ----------------
//   const handleNoProceed = () => {
//     setStep("review");
//   };

//   // ---------------- FINAL SUBMIT ----------------
//   const handleSubmit = async (skip = false) => {
//     try {
//       setLoading(true);

//       // submit review if provided
//       if (!skip) {
//         if (rating === 0) {
//           toast.error("Please provide a rating or skip");
//           setLoading(false);
//           return;
//         }


//       }

//       const res  = await endConsultation(consultationId);

//       if(res.data.success){

        
//         socket.emit('consultation:end',{sessionId:consultationId})
        
//         toast.success("Consultation ended");
//         closeModal();
        
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4">

//       {/* ---------------- STEP 1 ---------------- */}
//       {step === "confirm" && (
//         <>
//           <div className="text-center">
//             <h2 className="text-lg font-semibold">
//               End Consultation
//             </h2>

//             <p className="text-sm text-gray-600 mt-2">
//               Is there anything else you’d like to discuss before we wrap up today?
//             </p>
//           </div>

//           <div className="flex justify-end gap-3 mt-4">

//             <PrimaryButton
//               text="Yes"
//               onClick={handleYesContinue}
//               className="bg-green-600"
//             />

//             <button
//               onClick={handleNoProceed}
//               className="px-4 py-2 border rounded-md text-sm"
//             >
//               No
//             </button>
//           </div>
//         </>
//       )}

//       {/* ---------------- STEP 2 ---------------- */}
//       {step === "review" && (
//         <>
//           <div className="text-center">
//             <h2 className="text-lg font-semibold">
//               Rate your experience
//             </h2>
//             <p className="text-sm text-gray-500">
//               Your feedback helps improve care quality
//             </p>
//           </div>

//           {/* Rating */}
//           <div className="flex justify-center gap-2 text-2xl">
//             {[1,2,3,4,5].map((star) => (
//               <button
//                 key={star}
//                 onClick={() => setRating(star)}
//                 className={`${
//                   star <= rating ? "text-yellow-500" : "text-gray-300"
//                 }`}
//               >
//                 ★
//               </button>
//             ))}
//           </div>

//           {/* Review */}
//           <textarea
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//             placeholder="Write optional feedback..."
//             className="border rounded-md p-2 text-sm w-full"
//             rows={3}
//           />

//           {/* Actions */}
//           <div className="flex justify-end gap-2 mt-2">

//             <button
//               onClick={() => handleSubmit(true)}
//               className="px-4 py-2 border rounded-md text-sm"
//               disabled={loading}
//             >
//               Skip
//             </button>

//             <PrimaryButton
//               onClick={() => handleSubmit(false)}
//               text={loading ? "Submitting..." : "Submit & End"}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default EndConsultationModal;


import { socket } from "@/socket";
import { submitReview } from "../../../api/patient/patientApis";
import PrimaryButton from "@/components/shared/components/PrimaryButton";

const EndConsultationModal = ({ consultationId, closeModal }) => {
  const [step, setStep] = useState("confirm");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (skip = false) => {
  try {
    setLoading(true);

    let reviewError = false;

    // --------- Submit review (non-blocking) ----------
    if (!skip) {
      if (rating === 0) {
        toast.error("Please provide a rating or skip");
        setLoading(false);
        return;
      }

      try {
        const res = await submitReview(consultationId, {
          rating,
          review,
        });

        if (!res?.data?.success) {
          reviewError = true;
        }
      } catch (err) {
        reviewError = true;
        console.error("Review failed:", err);
      }
    }

    // --------- Always end consultation ----------
    const res = await endConsultation(consultationId);

    if (res?.data?.success) {
      socket.emit("consultation:end", {
        sessionId: consultationId,
      });

      if (reviewError) {
        toast("Consultation ended (review not saved)", {
          icon: "",
        });
      } else {
        toast.success("Consultation ended");
      }

      closeModal();
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full">

      {/* STEP 1 */}
      {step === "confirm" && (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              End Consultation?
            </h2>
            <p className="text-sm text-gray-500">
              Do you want to wrap up now, or continue the session?
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep("review")}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              End Now
            </button>

            <PrimaryButton
              text="Continue"
              onClick={closeModal}
              className="flex-1 bg-green-600 hover:bg-green-700"
            />
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === "review" && (
        <>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Rate Your Experience
            </h2>
            <p className="text-sm text-gray-500">
              Your feedback helps us improve
            </p>
          </div>

          {/* ---------- Rating -------- */}
          <div className="flex justify-center gap-2 text-3xl mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`transition transform hover:scale-125 ${
                  star <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Review Box */}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your feedback (optional)..."
            className="w-full mt-3 p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
            >
              Skip
            </button>

            <PrimaryButton
              onClick={() => handleSubmit(false)}
              text={loading ? "Submitting..." : "Submit & End"}
              className="flex-1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EndConsultationModal;