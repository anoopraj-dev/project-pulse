
import {
  getAvailabilityService,
  saveAvailabilityService,
  removeAvailabilitySlotService,
} from "../../services/doctor/availability.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ----------------- Get Availability ----------------
export const getAvailability = asyncHandler(async (req, res) => {
  const data = await getAvailabilityService(req.user.id);
  return res.status(200).json({ success: true, data });
});

// ----------------- Save Availability ----------------
export const saveAvailability = asyncHandler(async (req, res) => {
  await saveAvailabilityService(req.user.id, req.body);
  return res.status(200).json({ success: true, message: "Availability saved successfully" });
});

// ----------------- Remove Slot ----------------
export const removeAvailabilitySlot = asyncHandler(async (req, res) => {
  const { dateKey, slotId } = req.body;
  await removeAvailabilitySlotService(req.user.id, dateKey, slotId);
  return res.status(200).json({ success: true, message: "Slot removed successfully" });
});