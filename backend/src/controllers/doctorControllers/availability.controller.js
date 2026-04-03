import DoctorAvailability from "../../models/availability.model.js";

//----------------- Get doctor availability ----------------
export const getAvailability = async (req, res) => {
  try {
    const { id } = req.user;
    const availability = await DoctorAvailability.find({ doctorId: id }).sort({
      date: 1,
    });

    const formattedAvailability = availability.map((day) => ({
      date: day.date.toISOString().split("T")[0],
      slots: day.slots.map((slot) => ({
        start: slot.startTime.trim(),
        end: slot.endTime.trim(),
        isBooked: slot.isBooked ?? false,
      })),
    }));

    console.log(formattedAvailability);

    res.status(200).json({
      success: true,
      data: formattedAvailability,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//----------------- Save doctor availability ----------------
export const saveAvailability = async (req, res) => {
  try {
    const { id } = req.user;
    const payload = req.body;

    if (!Array.isArray(payload) || payload.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No availability provided",
      });
    }

    // Group slots by date
    const grouped = payload.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});

    for (const date in grouped) {
      const slotsPayload = grouped[date];

      // Format slots
      const formattedSlots = slotsPayload.map((slot) => ({
        startTime: slot.start,
        endTime: slot.end,
        isBooked: false,
      }));

      // Check existing availability
      let availability = await DoctorAvailability.findOne({
        doctorId: id,
        date: new Date(date),
      });

      if (availability) {
        // Preserve already booked slots
        const bookedSlots = availability.slots.filter((s) => s.isBooked);

        // Filter out duplicates: don't save if slot already exists (booked or not)
        const existingSlotKeys = availability.slots.map(
          (s) => `${s.startTime}-${s.endTime}`
        );

        const newSlots = formattedSlots.filter(
          (s) => !existingSlotKeys.includes(`${s.startTime}-${s.endTime}`)
        );

        // Merge booked + new unique slots
        availability.slots = [...bookedSlots, ...availability.slots.filter(s => s.isBooked === false && !newSlots.includes(s)), ...newSlots];

        await availability.save();
      } else {
        // Create new document
        await DoctorAvailability.create({
          doctorId: id,
          date: new Date(date),
          slots: formattedSlots,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Availability saved successfully",
    });
  } catch (error) {
    console.log("saveAvailability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ----------------- Remove doctor unbooked slot ----------------
export const removeAvailabilitySlot = async (req, res) => {
  try {
    const { id } = req.user; // doctor ID
    const { date, start, end } = req.body;

    if (!date || !start || !end) {
      return res.status(400).json({
        success: false,
        message: "Date, start and end time are required",
      });
    }

    const availability = await DoctorAvailability.findOne({
      doctorId: id,
      date: new Date(date),
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this date",
      });
    }

    // Filter out the slot if it exists and is NOT booked
    const slotIndex = availability.slots.findIndex(
      (s) => s.startTime === start && s.endTime === end && !s.isBooked
    );

    if (slotIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Slot not found or already booked",
      });
    }

    availability.slots.splice(slotIndex, 1);
    await availability.save();

    res.status(200).json({
      success: true,
      message: "Slot removed successfully",
    });
  } catch (error) {
    console.log("removeAvailabilitySlot error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};