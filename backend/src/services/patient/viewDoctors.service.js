
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

// -------- VIEW DOCTOR PROFILE --------
export const viewDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).select("-password");

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // fetch availability
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

  // -------- GET DOCTOR RATING --------
  const reviews = await Review.find({ doctor: doctorId });

  const rating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return {
    doctor,
    rating,
    ratingCount: reviews.length,
    availability: formattedAvailability,
  };
};