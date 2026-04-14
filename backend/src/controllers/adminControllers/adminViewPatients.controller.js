
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