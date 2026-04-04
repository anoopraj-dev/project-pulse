// import Patient from "../../models/patient.model.js"
// import { sendEmail } from "../../config/nodemailer.js";
// import { emailTemplate } from "../../utils/emailTemplate.js";
// import { getIO } from "../../socket.js";
// import { Notification } from "../../models/notification.model.js";

// //------------------- VIEW ALL PATIENTS ---------------------
// export const getAllPatients = async (req,res) =>{
//     try {
//         const patients = await Patient.find();
//         if(!patients) return res.status(404).json({
//             sucess:false,
//             message:'Data not found'
//         })
//         return res.status(200).json({
//             success:true,
//             message:'Data loaded successfully',
//             users:patients

//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false, message:'Internal server error'})
//     }
// }


// // ----------------- VIEW PATIENT PROFILE -------------------
// export const getPatientProfile = async (req, res) => {
//   const { id } = req.params;

//   try {

//     const patient = await Patient.findById(id);

//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Data not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Data loaded successfully",
//       user: patient,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// //----------------- BLOCK PATIENT ----------------
// export const blockPatientProfile = async (req, res) => {
//   try {
//     const io = getIO();
//     const { id } = req.params;
//     const {reason }= req.body;

//     const patient = await Patient.findById(id);
//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     patient.status = "blocked";
//     patient.blockedReason= reason;
//     await patient.save();

//      const notification = await Notification.create({
//       title:'Profile Blocked',
//       message:'Your profile has been blocked',
//       recipient:patient._id,
//       role:'patient'
//     })

//     io.to(patient._id.toString()).emit('notification:new',notification)

//     //-------------- SEND MAIL --------------
//     try {
//           const mailOptions = {
//             from: `"PULSE360" <${process.env.GMAIL_USER}>`,
//             to: patient.email,
//             subject: "Profile Status Updated",
//             html: emailTemplate({
//               title: "Account Blocked",
//               subtitle: "Patient Profile Review",
//               body: `
//                 <p>Hello <strong> ${patient.name}</strong>,</p>
//                 <p>Your profile status has been temperorily blocked:</p>
//                 <p> for <strong>${patient.blockedReason}</strong></p>
//                 <p> Kindly contact the support for further action </p>
//               `,
//               highlightText: `Current Status: ${patient.status}`,
//               highlightType: patient.status === "active" ? "success" : "error",
//             }),
//           };
    
//           await sendEmail(mailOptions);
//         } catch (emailError) {
//           console.error("Email failed:", emailError);
//         }
    
      
   

//     return res.status(200).json({
//       success: true,
//       message: "Patient blocked successfully",
//       user: patient,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


// //-------------- UNBLOCK PATIENT PROFILE -------------
// export const unblockPatientProfile = async (req, res) => {
//   const io = getIO();
//   try {
//     const { id } = req.params;

//     const patient = await Patient.findById(id);
//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     patient.status = "active";
//     patient.blockedReason='';
//     await patient.save();

//     const notification = await Notification.create({
//       title:'Profile Unblocked',
//       message:'Your profile has been unblocked',
//       recipient:patient._id,
//       role:'patient'
//     })

//     io.to(patient._id.toString()).emit('notification:new',notification)


//     return res.status(200).json({
//       success: true,
//       message: "Patient unblocked successfully",
//       user: patient,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


import {
  getAllPatientsService,
  getPatientProfileService,
  blockPatientService,
  unblockPatientService,
} from "../../services/admin/viewPatients.service.js";

//---------------- Get All Patients -----------------
export const getAllPatients = async (req, res) => {
  try {
    const patients = await getAllPatientsService();
    res.status(200).json({ success: true, message: "Data loaded successfully", users: patients });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//---------------- Get Patient Profile -------------
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await getPatientProfileService(req.params.id);
    res.status(200).json({ success: true, message: "Data loaded successfully", user: patient });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//---------------- Block Patient -------------------
export const blockPatientProfile = async (req, res) => {
  try {
    const patient = await blockPatientService(req.params.id, req.body.reason);
    res.status(200).json({ success: true, message: "Patient blocked successfully", user: patient });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//---------------- Unblock Patient -----------------
export const unblockPatientProfile = async (req, res) => {
  try {
    const patient = await unblockPatientService(req.params.id);
    res.status(200).json({ success: true, message: "Patient unblocked successfully", user: patient });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};