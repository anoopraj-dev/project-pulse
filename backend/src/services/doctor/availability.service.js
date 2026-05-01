
import DoctorAvailability from "../../models/availability.model.js";

// ----------------- Helper: Safe UTC Conversion ----------------
const buildUTCDate = (date, time) => {
  const [hours, minutes] = time.split(":").map(Number);

  const d = new Date(date);

  return new Date(Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    hours - 5,     // IST offset
    minutes - 30,
    0,
    0
  ));
};

// ----------------- Helper: Format time for frontend ----------------
const formatTimeLocal = (dateObj) => {
  if (!dateObj) return null;

  const date = new Date(dateObj);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });
};

// ----------------- Get Availability ----------------
export const getAvailabilityService = async (doctorId) => {
  const availability = await DoctorAvailability.find({ doctorId }).sort({
    dateKey: 1,
  });

  return availability.map((day) => ({
    date: day.dateKey,

    slots: day.slots.map((slot) => ({
      slotId: slot.slotId,

      start: formatTimeLocal(slot.startAt),
      end: formatTimeLocal(slot.endAt),

      isBooked: slot.status === "booked",
      isLocked: slot.status === "locked",
    })),
  }));
};

// ----------------- Save Availability ----------------
export const saveAvailabilityService = async (doctorId, payload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("No availability provided");
  }

  const grouped = payload.reduce((acc, item) => {
    const dateKey = item.date;

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);

    return acc;
  }, {});

  for (const dateKey in grouped) {
    const slotsPayload = grouped[dateKey];

    const formattedSlots = slotsPayload.map((slot) => {
      const startAt = buildUTCDate(slot.date, slot.start);
      const endAt = buildUTCDate(slot.date, slot.end);

       console.log(
    "Slot Debug:",
    startAt.toISOString(),
    new Date(startAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  );

      return {
        slotId: `${doctorId}_${dateKey}_${startAt.toISOString()}`,

        startAt,
        endAt,

        status: "available",
        lockExpiresAt: null,
        appointmentId: null,
      };
    });

    let availability = await DoctorAvailability.findOne({
      doctorId,
      dateKey,
    });

    if (availability) {
      const existingSlotIds = new Set(
        availability.slots.map((s) => s.slotId)
      );

      const newSlots = formattedSlots.filter(
        (s) => !existingSlotIds.has(s.slotId)
      );

      availability.slots.push(...newSlots);

      await availability.save();
    } else {
      await DoctorAvailability.create({
        doctorId,
        dateKey,
        slots: formattedSlots,
      });
    }
  }

  

  return true;
};

// ----------------- Remove Slot ----------------
export const removeAvailabilitySlotService = async (
  doctorId,
  dateKey,
  slotId
) => {

  if (!dateKey || !slotId) {
    throw new Error("DateKey and slotId are required");
  }

  const availability = await DoctorAvailability.findOne({
    doctorId,
    dateKey,
  });

  if (!availability) {
    throw new Error("No availability found for this date");
  }

  const slot = availability.slots.find((s) =>{
     return s.slotId.toString() === slotId.toString()
  } 
);

  if (!slot) {
    throw new Error("Slot not found");
  }

  if (slot.status !== "available") {
    throw new Error("Cannot remove booked/locked slot");
  }

  availability.slots = availability.slots.filter(
    (s) => s.slotId !== slotId
  );

  await availability.save();

  return true;
};