import Doctor from "../../models/doctor.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getApprovedDoctors = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const doctors = await Doctor.find({ status: "approved" })
    .select("name professionalInfo.specializations profilePicture")
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, doctors });
});
