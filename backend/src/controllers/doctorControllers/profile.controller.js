import Doctor from "../../models/doctor.model.js";

export const getDoctorProfile = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    if (!req.user || req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const doctor = await Doctor.findById( req.user.id ).select(
      "-password"
    );
    console.log('doctor',doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      user: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
