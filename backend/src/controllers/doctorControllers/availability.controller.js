
import {
  getAvailabilityService,
  saveAvailabilityService,
  removeAvailabilitySlotService,
} from "../../services/doctor/availability.service.js";

// ----------------- Get Availability ----------------
export const getAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const data = await getAvailabilityService(doctorId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("getAvailability error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ----------------- Save Availability ----------------
export const saveAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;

    await saveAvailabilityService(doctorId, req.body);

    return res.status(200).json({
      success: true,
      message: "Availability saved successfully",
    });
  } catch (error) {
    console.log("saveAvailability error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ----------------- Remove Slot ----------------
export const removeAvailabilitySlot = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date, start, end } = req.body;

    await removeAvailabilitySlotService(
      doctorId,
      date,
      start,
      end
    );

    return res.status(200).json({
      success: true,
      message: "Slot removed successfully",
    });
  } catch (error) {
    console.log("removeAvailabilitySlot error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};