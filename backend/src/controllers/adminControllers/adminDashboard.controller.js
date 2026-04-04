// import Doctor from "../../models/doctor.model.js";
// import Patient from "../../models/patient.model.js";

// import { Notification } from "../../models/notification.model.js";



// //------------- GET ADMIN DASHBORD---------------

// export const getAdminDashboard = async (req, res) => {
//   try {
//     const [doctorCount, patientCount] = await Promise.all([
//       Doctor.countDocuments(),
//       Patient.countDocuments(),
//     ]);

//     const pendingDoctorsApproval = await Doctor.find({ status: "pending" })
//       .select("name professionalInfo.specializations createdAt profilePicture")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       doctorCount,
//       patientCount,
//       pendingDoctorsApproval,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to load dashboard stats",
//     });
//   }
// };

// //-------------- REVIEW PENDING PROFILES -----------------

// export const getPendingDoctorProfile = async (req, res) => {
//   try {
//     const id  = req.params.id;
//     const doctor = await Doctor.findById(id).select('-password');
//     if(!doctor) return res.status(400).json({
//         success:false,
//         message:'Doctor not found!'
//     })
//     else{
//         return res.status(200).json({
//             success:true,
//             user: doctor
//         })
//     }
//   } catch (error) {
//     console.log(error)
//   }
// };

// // --------------- GET DOCTOR DOCUMENTS ------------------
// export const getDoctorDocuments = async(req,res) => {
//   try {
//     console.log('document route hit')
//     const id = req.params.id;
//     const doctor = await Doctor.findById(id);
//     if(!doctor) return res.status(404).json({success:false, message:'Doctor not found!'})
//     res.status(200).json({success: true, user : doctor })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       success:false,
//       message:'Internal Server Error'
//     })
//   }
// }


// //--------------------- GET NOTIFICATIONS -------------------
// export const getAdminNotifications = async (req,res) => {
//   const notifications = await Notification.find({role: 'admin'}).sort({createdAt: -1});

//   res.json({
//     success: true,
//     notifications
//   })
// }



  
import {
  getAdminDashboardService,
  getPendingDoctorProfileService,
  getDoctorDocumentsService,
  getAdminNotificationsService,
} from "../../services/admin/dashboard.service.js";

//------------- GET ADMIN DASHBOARD -------------
export const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardService();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

//-------------- REVIEW PENDING PROFILES -------------
export const getPendingDoctorProfile = async (req, res) => {
  try {
    const doctor = await getPendingDoctorProfileService(req.params.id);
    res.status(200).json({ success: true, user: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// --------------- GET DOCTOR DOCUMENTS -------------
export const getDoctorDocuments = async (req, res) => {
  try {
    const doctor = await getDoctorDocumentsService(req.params.id);
    res.status(200).json({ success: true, user: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//--------------------- GET NOTIFICATIONS -------------
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await getAdminNotificationsService();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};
