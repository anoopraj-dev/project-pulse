
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