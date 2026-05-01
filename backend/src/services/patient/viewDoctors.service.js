
import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Review from "../../models/review.model.js";

// -------- GET APPROVED DOCTORS --------
export const getApprovedDoctorsService = async () => {
  const doctors = await Doctor.find({
    status: "approved",
    isBlocked: false,
  }).select("-password");

  if (!doctors || doctors.length === 0) {
    throw new Error("Doctors not found");
  }

  // -------- GET DOCTOR RATINGS --------
  const reviews = await Review.find({
    doctor: { $in: doctors.map((d) => d._id) },
  });

  const ratingMap = {};

  reviews.forEach((rev) => {
    const id = rev.doctor.toString();

    if (!ratingMap[id]) {
      ratingMap[id] = { total: 0, count: 0 };
    }

    ratingMap[id].total += rev.rating || 0;
    ratingMap[id].count += 1;
  });

  const doctorsWithRating = doctors.map((doc) => {
    const id = doc._id.toString();
    const data = ratingMap[id];

    return {
      ...doc.toObject(),
      rating: data ? data.total / data.count : 0,
      ratingCount: data ? data.count : 0,
    };
  });

  return doctorsWithRating;
};


export const viewDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new Error("Doctor not found");
  }

  const availabilityDocs = await DoctorAvailability.find({ doctorId }).sort({
    dateKey: 1,
  });

  const now = new Date();

  const availability = availabilityDocs.map((day) => {
    const slots = day.slots
      .map((slot) => {
        let startAt;
        let endAt;

        if (slot.startAt && slot.endAt) {
          startAt = new Date(slot.startAt);
          endAt = new Date(slot.endAt);
        } else {
          startAt = new Date(`${day.dateKey}T${slot.start}:00`);
          endAt = new Date(`${day.dateKey}T${slot.end}:00`);
        }

        const isBooked = slot.status === "booked";
        const isLocked = slot.status === "locked";
        const isExpired = slot.status === "available" && startAt < now;

        return {
          slotId: slot.slotId,

          startAt,
          endAt,

          start:
            slot.start ||
            startAt.toTimeString().slice(0, 5),

          end:
            slot.end ||
            endAt.toTimeString().slice(0, 5),

          isBooked,
          isLocked,
          isExpired,
        };
      })
      .filter(
        (slot) =>
          !slot.isBooked &&
          !slot.isLocked &&
          !slot.isExpired
      )
      .sort((a, b) => a.startAt - b.startAt);

    return {
      date: day.dateKey,
      slots,
    };
  });

  return {
    doctor,
    availability,
  };
};