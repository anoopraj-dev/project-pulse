import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";

// -------- GET APPROVED DOCTORS --------
export const getApprovedDoctorsService = async () => {
  const doctors = await Doctor.find({
    status: "approved",
    isBlocked: false,
  }).select("-password");

  if (!doctors || doctors.length === 0) {
    throw new Error("Doctors not found");
  }

  return doctors;
};

// -------- VIEW DOCTOR PROFILE --------
export const viewDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).select("-password");

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // fetch availability
  const availability = await DoctorAvailability
    .find({ doctorId })
    .sort({ date: 1 });

  const formattedAvailability = availability.map((day) => ({
    date: day.date.toISOString().split("T")[0],
    slots: day.slots.map((slot) => ({
      startTime: slot.startTime.trim(),
      endTime: slot.endTime.trim(),
      isBooked: slot.isBooked ?? false,
    })),
  }));

  return {
    doctor,
    availability: formattedAvailability,
  };
};