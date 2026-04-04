// import Doctor from "../../models/doctor.model.js";
// import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

// //-------DOCTOR ONBOARDING CONTROLLERS-------//

// //-------- PERSONAL INFO -------//

// export const updatePersonalInfo = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized access" });
//     }

//     const {
//       gender,
//       phone,
//       dob,
//       clinicName,
//       clinicAddress,
//       about,
//       location,
//       mode= 'replace',
//     } = req.body;

//     const doctor = await Doctor.findById(req.user.id);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     let profilePictureUrl = doctor.profilePicture || "";
//     console.log('req.file', req.file)
//     if (req.file) {
//       console.log(req.file)
//       const uploaded = await uploadToCloudinary(req.file);
//       profilePictureUrl = uploaded.secure_url;
//     }

//     const updateData = {
//       gender,
//       phone,
//       dob,
//       clinicName,
//       clinicAddress,
//       about,
//       location,
//       profilePicture: profilePictureUrl,
//     };

//     const updatedDoctor = await Doctor.findByIdAndUpdate(
//       req.user.id,
//       { $set: updateData },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Personal information updated successfully",
//       data: updatedDoctor,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// //------- PROFESSIONAL INFO  (qualification / education / specialization / license)-------//

// export const updateProfessionalInfo = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized access" });
//     }

//     let {
//       qualifications,
//       specializations,
//       experience,
//       education,
//       registrationNumber,
//       stateCouncil,
//       yearOfRegistration,
//       mode = "replace", 
//     } = req.body;

//     const doctor = await Doctor.findById(req.user.id);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     const setData = {};
//     const pushData = {};

//     // ---------------- BASIC INFO (REPLACE) ----------------
//     if (qualifications)
//       setData["professionalInfo.qualifications"] = qualifications;

//     if (specializations)
//       setData["professionalInfo.specializations"] = specializations;

//     // ---------------- MEDICAL LICENSE (REPLACE) ----------------
//     if (req.files?.proofDocument?.length > 0) {
//       const uploadedProofs = await Promise.all(
//         req.files.proofDocument.map(file =>
//           uploadToCloudinary(file).then(r => r.secure_url)
//         )
//       );

//       setData["professionalInfo.medicalLicense"] = {
//         registrationNumber: registrationNumber || "",
//         stateCouncil: stateCouncil || "",
//         yearOfRegistration: Number(yearOfRegistration) || null,
//         proofDocument: uploadedProofs,
//       };
//     }

//     // ---------------- EXPERIENCE (APPEND ) ----------------
//     if (experience) {
//       const parsedExperience =
//         typeof experience === "string" ? JSON.parse(experience) : experience;

//       const expFiles = req.files?.experienceCertificate || [];

//       const preparedExperience = await Promise.all(
//         parsedExperience.map(async (exp, index) => ({
//           years: Number(exp.years) || 0,
//           hospitalName: exp.hospital || "",
//           location: exp.location || "",
//           experienceCertificate: expFiles[index]
//             ? (await uploadToCloudinary(expFiles[index])).secure_url
//             : "",
//         }))
//       );

//       if (mode === "append") {
//         pushData["professionalInfo.experience"] = { $each: preparedExperience };
//       } else {
//         setData["professionalInfo.experience"] = preparedExperience;
//       }
//     }

//     // ---------------- EDUCATION (APPEND / REPLACE) ----------------
//     if (education) {
//       const parsedEducation =
//         typeof education === "string" ? JSON.parse(education) : education;

//       const eduFiles = req.files?.educationCertificate || [];

//       const preparedEducation = await Promise.all(
//         parsedEducation.map(async (edu, index) => ({
//           degree: edu.degree || "",
//           college: edu.college || "",
//           completionYear: Number(edu.completionYear) || 0,
//           educationCertificate: eduFiles[index]
//             ? (await uploadToCloudinary(eduFiles[index])).secure_url
//             : "",
//         }))
//       );

//       if (mode === "append") {
//         pushData["professionalInfo.education"] = { $each: preparedEducation };
//       } else {
//         setData["professionalInfo.education"] = preparedEducation;
//       }
//     }

//     // ---------------- FINAL UPDATE ----------------
//     const updateQuery = {};
//     if (Object.keys(setData).length) updateQuery.$set = setData;
//     if (Object.keys(pushData).length) updateQuery.$push = pushData;

//     const updatedDoctor = await Doctor.findByIdAndUpdate(
//       req.user.id,
//       updateQuery,
//       { new: true }
//     ).select('-password');

//     return res.status(200).json({
//       success: true,
//       message: "Professional information updated successfully",
//       data: updatedDoctor.professionalInfo,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating professional info",
//       error: error.message,
//     });
//   }
// };



// //----------------- SERVICE INFO -------------------

// export const updateServicesInfo = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     const { services } = req.body;

//     if (!services) {
//       return res.status(400).json({
//         success: false,
//         message: "Services data missing",
//       });
//     }

//     let parsedServices;

//     try {
//       parsedServices = typeof services === "string"
//         ? JSON.parse(services)
//         : services;
//     } catch {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid services format",
//       });
//     }

//     if (!Array.isArray(parsedServices)) {
//       return res.status(400).json({
//         success: false,
//         message: "Services must be an array",
//       });
//     }

//     const doctor = await Doctor.findByIdAndUpdate(
//       req.user.id,
//       {
//         $set: {
//           services: parsedServices,
//           firstLogin: false,
//         },
//       },
//       { new: true }
//     ).select('-password');

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Service info updated successfully",
//       data: doctor,
//       firstLogin:doctor.firstLogin
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


import {
  updatePersonalInfoService,
  updateProfessionalInfoService,
  updateServicesInfoService,
} from "../../services/doctor/onboarding.service.js";

// -------- PERSONAL INFO --------
export const updatePersonalInfo = async (req, res) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updatedDoctor = await updatePersonalInfoService(
      doctorId,
      req.body,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// -------- PROFESSIONAL INFO --------
export const updateProfessionalInfo = async (req, res) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = await updateProfessionalInfoService(
      doctorId,
      req.body,
      req.files
    );

    return res.status(200).json({
      success: true,
      message: "Professional information updated successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// -------- SERVICES INFO --------
export const updateServicesInfo = async (req, res) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doctor = await updateServicesInfoService(
      doctorId,
      req.body.services
    );

    return res.status(200).json({
      success: true,
      message: "Service info updated successfully",
      data: doctor,
      firstLogin: doctor.firstLogin,
    });
  } catch (error) {
    return res.status(
      error.message.includes("Invalid") || error.message.includes("missing")
        ? 400
        : 500
    ).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};