// import Doctor from "../../models/doctor.model.js";
// import DoctorAvailability from "../../models/availability.model.js";
// import { getIO } from "../../socket.js";
// import { Notification } from "../../models/notification.model.js";

// // ------------- GET PROFILE ----------
// export const getDoctorProfile = async (req, res) => {
//   try {
//     if (!req.user || req.user.role !== "doctor") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const doctor = await Doctor.findById(req.user.id).select("-password");

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     //----------------- fetch doctor availability ------------
//     const availability = await DoctorAvailability.find({
//       doctorId: req.user.id,
//     }).sort({ date: 1 });

//     const formattedAvailability = availability.map((day) => ({
//       date: day.date.toISOString().split("T")[0],
//       slots: day.slots.map((slot) => ({
//         startTime: slot.startTime.trim(),
//         endTime: slot.endTime.trim(),
//         isBooked: slot.isBooked ?? false,
//       })),
//     }));

//     res.json({
//       success: true,
//       user: doctor,
//       availability: formattedAvailability || [],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --------------- UPDATE PROFILE -----------------

// const safeParse = (value) => {
//   if (!value) return undefined;

//   if (typeof value === "string") {
//     try {
//       return JSON.parse(value);
//     } catch {
//       return undefined;
//     }
//   }

//   return value;
// };

// export const updateDoctorProfile = async (req, res) => {
//   try {
//     const {
//       _id,
//       professionalInfo,
//       services,
//       qualifications,
//       specializations,
//       ...rest
//     } = req.body;

//     const updatePayload = { ...rest };

//     // Parse services
//     if (services) {
//       const parsedServices = safeParse(services);
//       updatePayload.services = parsedServices
//         .map((service, index) => {
//           if (!service || service.fees === undefined || service.fees === "")
//             return null;
//           return {
//             serviceType: index === 0 ? "online" : "offline",
//             fees: Number(service.fees),
//           };
//         })
//         .filter(Boolean);
//     }

//     // Parse qualifications and specializations
//     console.log(qualifications, specializations);
//     if (qualifications) {
//       updatePayload.qualifications = safeParse(qualifications) || [];
//     }
//     if (specializations) {
//       updatePayload.specializations = safeParse(specializations) || [];
//     }

//     const doctor = await Doctor.findByIdAndUpdate(
//       _id,
//       { $set: updatePayload },
//       { new: true, runValidators: true, context: "query" },
//     );

//     if (!doctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor not found" });
//     }

//     return res.status(200).json({ success: true, user: doctor });
//   } catch (error) {
//     console.error("Update doctor profile error:", error);
//     if (error.name === "ValidationError") {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// //----------------- PROFILE RESUBMISSION -------------------
// export const requestProfileResubmission = async (req, res) => {
//   try {
//     const doctorId = req.user.id;
//     const io = getIO();

//     const doctor = await Doctor.findById(doctorId);

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     if (doctor.status !== "rejected") {
//       return res.status(400).json({
//         message: "Resubmission allowed only for rejected profiles",
//       });
//     }

//     if (doctor.submissionCount >= 3) {
//       return res.status(403).json({
//         message: "Maximum resubmission attempts reached",
//       });
//     }

//     doctor.resubmissionRequested = true;
//     doctor.status = "requestedResubmission";

//     await doctor.save();

//     const notification = await Notification.create({
//       title: "New Profile Resubmission request",
//       message: `Dr. ${doctor.name} has requested for a profile re-submission`,
//       recipient: "admin",
//       role: "admin",
//       read: false,
//     });

//     io.to("role:admin").emit("notification:new", notification);

//     return res.status(200).json(
//       {
//         success: true,
//         message: "Resubmission request sent to admin",
//         user: doctor,
//       },
//       { new: true },
//     );
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Resubmission request failed",
//     });
//   }
// };

// // ---------------- RESUBMIT PROFILE -------------------
// export const resubmitProfile = async (req, res) => {
//   const io = getIO();
//   try {
//     const doctorId = req.user.id;

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor profile not found",
//       });
//     }

//     // Update resubmission state
//     doctor.submissionCount = (doctor.submissionCount || 0) + 1;
//     doctor.resubmissionApproved = false;
//     doctor.status = "pending";
//     await doctor.save();

//     const notification = await Notification.create({
//       title: "New Profile Resubmission",
//       message: `Dr. ${doctor.name} has submitted updated profile`,
//       recipient: "admin",
//       role: "admin",
//       read: false,
//     });

//     io.to("role:admin").emit("notification:new", notification);

//     return res.status(200).json({
//       success: true,
//       message: "Profile resubmitted successfully",
//       user: doctor,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to resubmit profile",
//     });
//   }
// };


import {
  getDoctorProfileService,
  updateDoctorProfileService,
  requestProfileResubmissionService,
  resubmitProfileService,
} from "../../services/doctor/profile.service.js";

import { getIO } from "../../socket.js";

// ---------- GET PROFILE ----------
export const getDoctorProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { doctor, availability } =
      await getDoctorProfileService(req.user.id);

    return res.json({
      success: true,
      user: doctor,
      availability,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ---------- UPDATE PROFILE ----------
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await updateDoctorProfileService(req.body);

    return res.status(200).json({
      success: true,
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message === "Doctor not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ---------- REQUEST RESUBMISSION ----------
export const requestProfileResubmission = async (req, res) => {
  try {
    const io = getIO();

    const { doctor, notification } =
      await requestProfileResubmissionService(req.user.id);

    io.to("role:admin").emit("notification:new", notification);

    return res.status(200).json({
      success: true,
      message: "Resubmission request sent to admin",
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 400
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- RESUBMIT PROFILE ----------
export const resubmitProfile = async (req, res) => {
  try {
    const io = getIO();

    const { doctor, notification } =
      await resubmitProfileService(req.user.id);

    io.to("role:admin").emit("notification:new", notification);

    return res.status(200).json({
      success: true,
      message: "Profile resubmitted successfully",
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};