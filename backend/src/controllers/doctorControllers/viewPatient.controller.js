import Patient from "../../models/patient.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

//-------------- View Patient Profile --------------
export const viewPatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id, "-password");

  if (!patient) throw new AppError("Patient information not found", 404);

  res.status(200).json({ success: true, user: patient });
});