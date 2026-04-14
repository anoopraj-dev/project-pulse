
import {
  getApprovedDoctorsService,
  viewDoctorProfileService,
} from "../../services/patient/viewDoctors.service.js";

// -------- GET ALL DOCTORS --------
export const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await getApprovedDoctorsService();

    return res.status(200).json({
      success: true,
      message: "Fetched all doctors",
      users: doctors,
    });
  } catch (error) {
    return res.status(
      error.message === "Doctors not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// -------- VIEW DOCTOR PROFILE --------
export const viewDoctorProfile = async (req, res) => {
  try {
    const { doctor, availability } =
      await viewDoctorProfileService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      user: doctor,
      availability,
    });
  } catch (error) {
    return res.status(
      error.message === "Doctor not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};