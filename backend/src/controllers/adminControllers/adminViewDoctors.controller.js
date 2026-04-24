
import {
  approveDoctorService,
  rejectDoctorService,
  blockDoctorService,
  unblockDoctorService,
  revokeDoctorStatusService,
  getAllDoctorsService,
} from "../../services/admin/viewDoctors.service.js";

//---------------- Approve Doctor ----------------------
export const approveDoctorsRequest = async (req, res) => {
  try {
    const doctor = await approveDoctorService(req.params.id);
    res.status(200).json({ success: true, message: `Approved Dr ${doctor.name}`, user: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//---------------- Reject Doctor -----------------------
export const rejectDoctorsRequest = async (req, res) => {
  try {
    const doctor = await rejectDoctorService(req.params.id, req.body.reason);
    res.status(200).json({ success: true, message: `Rejected Dr ${doctor.name}`, user: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//---------------- Block Doctor ------------------------
export const blockDoctorProfile = async (req, res) => {
  try {
    const doctor = await blockDoctorService(req.params.id, req.body.reason);
    res.status(200).json({ success: true, message: `Blocked Dr ${doctor.name}`, user: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//---------------- Unblock Doctor ----------------------
export const unblockDoctorProfile = async (req, res) => {
  try {
    const doctor = await unblockDoctorService(req.params.id);
    res.status(200).json({ success: true, message: `Unblocked Dr ${doctor.name}`, user: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//---------------- Revoke Doctor Status ----------------
export const revokeDoctorStatus = async (req, res) => {
  try {
    const doctor = await revokeDoctorStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: `Doctor status updated to ${doctor.status}`, user: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//---------------- Get All Doctors ---------------------
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctorsService();
    res.status(200).json({ success: true, message: "Data loaded successfully", users: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};