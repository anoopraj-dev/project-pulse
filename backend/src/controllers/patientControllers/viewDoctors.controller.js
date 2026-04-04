// import Doctor from "../../models/doctor.model.js";
// import DoctorAvailability from '../../models/availability.model.js'


// //--------------- GET ALL DOCTORS ---------------
// export const getApprovedDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find();

//     if (!doctors)
//       return res.status(404).json({
//         success: false,
//         message: "Data not found",
//       });

//     return res.status(200).json({
//       success: true,
//       message: "Fetched all doctors",
//       users: doctors,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// //------------------- VIEW DOCTORS PROFILE -------------------
// export const viewDoctorProfile = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const doctor = await Doctor.findById(id);
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     //----------------- fetch doctor availability ------------
//     const availability = await DoctorAvailability
//       .find({ doctorId: id })
//       .sort({ date: 1 });

//     const formattedAvailability = availability.map((day) => ({
//   date: day.date.toISOString().split("T")[0],
//   slots: day.slots.map((slot) => ({
//     startTime: slot.startTime.trim(),
//     endTime: slot.endTime.trim(),
//     isBooked: slot.isBooked ?? false, 
//   })),
// }));


//     return res.status(200).json({
//       success: true,
//       message: "Data loaded successfully",
//       user: doctor,
//       availability:formattedAvailability || []
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

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