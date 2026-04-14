import DoctorAvailability from "../../models/availability.model.js";

// ----------------- Get Availability ----------------
export const getAvailabilityService = async (doctorId) => {
  const availability = await DoctorAvailability.find({ doctorId }).sort({
    date: 1,
  });

  return availability.map((day) => ({
    date: day.date.toISOString().split("T")[0],
    slots: day.slots.map((slot) => ({
      start: slot.startTime.trim(),
      end: slot.endTime.trim(),
      isBooked: slot.isBooked ?? false,
    })),
  }));
};

// ----------------- Save Availability ----------------
export const saveAvailabilityService = async (doctorId, payload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("No availability provided");
  }

  const grouped = payload.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  for (const date in grouped) {
    const slotsPayload = grouped[date];

    const formattedSlots = slotsPayload.map((slot) => ({
      startTime: slot.start,
      endTime: slot.end,
      isBooked: false,
    }));

    let availability = await DoctorAvailability.findOne({
      doctorId,
      date: new Date(date),
    });

    if (availability) {
      const bookedSlots = availability.slots.filter((s) => s.isBooked);

      const existingSlotKeys = availability.slots.map(
        (s) => `${s.startTime}-${s.endTime}`
      );

      const newSlots = formattedSlots.filter(
        (s) => !existingSlotKeys.includes(`${s.startTime}-${s.endTime}`)
      );

      availability.slots = [
        ...bookedSlots,
        ...availability.slots.filter(
          (s) =>
            !s.isBooked &&
            !newSlots.some(
              (n) =>
                n.startTime === s.startTime && n.endTime === s.endTime
            )
        ),
        ...newSlots,
      ];

      await availability.save();
    } else {
      await DoctorAvailability.create({
        doctorId,
        date: new Date(date),
        slots: formattedSlots,
      });
    }
  }

  return true;
};

// ----------------- Remove Slot ----------------
export const removeAvailabilitySlotService = async (
  doctorId,
  date,
  start,
  end
) => {
  if (!date || !start || !end) {
    throw new Error("Date, start and end time are required");
  }

  const availability = await DoctorAvailability.findOne({
    doctorId,
    date: new Date(date),
  });

  if (!availability) {
    throw new Error("No availability found for this date");
  }

  const slotIndex = availability.slots.findIndex(
    (s) =>
      s.startTime === start &&
      s.endTime === end &&
      !s.isBooked
  );

  if (slotIndex === -1) {
    throw new Error("Slot not found or already booked");
  }

  availability.slots.splice(slotIndex, 1);
  await availability.save();

  return true;
};