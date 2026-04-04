
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
