import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import { Notification } from "../../models/notification.model.js";

// ---------- GET PROFILE ----------
export const getDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).select("-password");
  if (!doctor) throw new Error("Doctor not found");

  const availability = await DoctorAvailability.find({ doctorId }).sort({
    date: 1,
  });

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
    availability: formattedAvailability || [],
  };
};

// ---------- UPDATE PROFILE ----------
const safeParse = (value) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  return value;
};

export const updateDoctorProfileService = async (payload) => {
  const {
    _id,
    services,
    qualifications,
    specializations,
    ...rest
  } = payload;

  const updatePayload = { ...rest };

  if (services) {
    const parsedServices = safeParse(services);

    updatePayload.services = parsedServices
      .map((service, index) => {
        if (!service || service.fees === undefined || service.fees === "")
          return null;

        return {
          serviceType: index === 0 ? "online" : "offline",
          fees: Number(service.fees),
        };
      })
      .filter(Boolean);
  }

  if (qualifications) {
    updatePayload.qualifications = safeParse(qualifications) || [];
  }

  if (specializations) {
    updatePayload.specializations = safeParse(specializations) || [];
  }

  const doctor = await Doctor.findByIdAndUpdate(
    _id,
    { $set: updatePayload },
    { new: true, runValidators: true, context: "query" }
  );

  if (!doctor) throw new Error("Doctor not found");

  return doctor;
};

// ---------- REQUEST RESUBMISSION ----------
export const requestProfileResubmissionService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  if (doctor.status !== "rejected") {
    throw new Error("Resubmission allowed only for rejected profiles");
  }

  if (doctor.submissionCount >= 3) {
    throw new Error("Maximum resubmission attempts reached");
  }

  doctor.resubmissionRequested = true;
  doctor.status = "requestedResubmission";

  await doctor.save();

  const notification = await Notification.create({
    title: "New Profile Resubmission request",
    message: `Dr. ${doctor.name} has requested for a profile re-submission`,
    recipient: "admin",
    role: "admin",
    read: false,
  });

  return { doctor, notification };
};

// ---------- RESUBMIT PROFILE ----------
export const resubmitProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor profile not found");

  doctor.submissionCount = (doctor.submissionCount || 0) + 1;
  doctor.resubmissionApproved = false;
  doctor.status = "pending";

  await doctor.save();

  const notification = await Notification.create({
    title: "New Profile Resubmission",
    message: `Dr. ${doctor.name} has submitted updated profile`,
    recipient: "admin",
    role: "admin",
    read: false,
  });

  return { doctor, notification };
};