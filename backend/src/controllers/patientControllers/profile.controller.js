import Patient from "../../models/patient.model.js";

//-------------- GET PATIENT PROFILE -----------

export const getPatientProfile = async (req, res) => {

  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const patient = await Patient.findById(req.user.id).select("-password");

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

// ---------------- UPDATE PATIENT PROFILE --------------

export const updatePatientProfile = async (req, res) => {
  const { _id, ...updatedData } = req.body;
  try {
    const patient = await Patient.findByIdAndUpdate(_id, { $set: updatedData}, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: patient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
