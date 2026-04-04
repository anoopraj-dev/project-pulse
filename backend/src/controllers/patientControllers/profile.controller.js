
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