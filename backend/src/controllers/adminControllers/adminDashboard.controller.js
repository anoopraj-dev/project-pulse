
import {
  getAdminDashboardService,
  getPendingDoctorProfileService,
  getDoctorDocumentsService,
  getAdminNotificationsService,
  dashboardCountsService,
  revenueOverviewService,
  userGrowthService,
  getDashboardSupportDataService
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



export const dashboardCounts = async (req, res) => {
  try {
    const counts = await dashboardCountsService(); 

    return res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Counts controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
    });
  }
};

//------------- Dashboard revenue -----------
export const revenueDashboardOverview = async (req,res) => {
  try {
    const {range} = req.query
    console.log(range)
    const data = await revenueOverviewService(range);
  res.status(200).json({
    success:true,
    message:'Fetched revenue over view',
    data
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:error
    })
  }
}

//------------- Dashboard user growth -------------
export const dashboardUserGrowth = async(req , res) =>{
  try {
    const data = await userGrowthService();

    res.status(200).json({
      success:true,
      data,
    })
  } catch (error) {
    console.log('Controller error:',error);

    return status(500).json({
      success:false,
      message:'Failed to fetch user growth'
    })
  }
}

//------- Support system data ------------

export const dashboardSupportData = async (req, res) => {
  try {
    const data = await getDashboardSupportDataService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard Support Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard support data",
    });
  }
};