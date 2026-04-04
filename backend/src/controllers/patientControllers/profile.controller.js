// import Patient from "../../models/patient.model.js";

// //-------------- GET PATIENT PROFILE -----------

// export const getPatientProfile = async (req, res) => {

//   try {
//     if (!req.user || req.user.role !== "patient") {
//       return res.status(403).json({ message: "Not authorized" });
//     }
//     const patient = await Patient.findById(req.user.id).select("-password");

//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     res.json({
//       success: true,
//       user: patient,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ---------------- UPDATE PATIENT PROFILE --------------

// export const updatePatientProfile = async (req, res) => {
 
//   try {
//     const updatedData = {...req.body};

//     if(req.file){
//       updatedData.profilePicture = req.file.path;
//     }

//     //------------ remove undefined or null fields ------------
//     Object.keys(updatedData).forEach((key) =>{
//       if(
//         updatedData[key] === undefined ||
//         updatedData[key] === null ||
//         updatedData[key] === ''
//       ){
//         delete updatedData[key];
//       }
//     })
//     const patient = await Patient.findByIdAndUpdate(req.user.id, { $set: updatedData}, {
//       new: true,
//     }).select('-password');

//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       user: patient,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


import {
  getPatientProfileService,
  updatePatientProfileService,
} from "../../services/patient/profile.service.js";

// -------- GET PROFILE --------
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await getPatientProfileService(req.user);

    return res.json({
      success: true,
      user: patient,
    });
  } catch (error) {
    return res.status(
      error.message === "Not authorized" ? 403 :
      error.message === "Patient not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// -------- UPDATE PROFILE --------
export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await updatePatientProfileService(
      req.user.id,
      req.body,
      req.file
    );

    return res.status(200).json({
      success: true,
      user: patient,
    });
  } catch (error) {
    return res.status(
      error.message === "Patient not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};