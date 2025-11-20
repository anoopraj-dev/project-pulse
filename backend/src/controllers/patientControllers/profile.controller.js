import Patient from "../../models/patient.model.js";

export const getPatientProfile = async (req, res) => {
  const token = req.cookies.token;
 

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const patient = await Patient.findById(req.user.id ).select(
      "-password"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      user: patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
