import Doctor from "../../models/doctor.model.js";

export const getApprovedDoctors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const doctors = await Doctor.find({ status: "approved" })
      .select("name professionalInfo.specializations profilePicture ")
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};
