
import { patientDashboardChartService, patientDashboardStatsService, patientPrescriptionsService, patientVitalsService, upcomingAppointmentsService } from "../../services/patient/dashboard.service.js";

//-------- stats -----------
export const dashboardStats = async (req, res) => {
  try {
    const patientId = req.user.id; // assuming auth middleware

    const data = await patientDashboardStatsService(patientId)
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

//------------- upcoming appointments --------------
export const patientUpcomingAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const data = await upcomingAppointmentsService(patientId)

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Upcoming appointments error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming appointments",
    });
  }
};

//-------------- chart data ----------
export const patientDashboardChart = async (req, res) => {
  try {
    const patientId = req.user.id;

    const data = await patientDashboardChartService(patientId)

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Dashboard chart error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard chart",
    });
  }
};

//------------ prescriptions -------------
export const patientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user?.id;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const prescriptions = await patientPrescriptionsService(patientId);

    return res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    console.error("Prescription fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};

//------------ Vitals ----------------
export const patientVitals = async (req, res) => {
  try {
    const patientId = req.user.id;

    const patient = await patientVitalsService(patientId);

    if (!patient) {
      return res.json({
        success: true,
        data: null,
      });
    }

    return res.json({
      success: true,
      data: patient.medical_history,
    });
  } catch (err) {
    console.error("Vitals error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vitals",
    });
  }
};