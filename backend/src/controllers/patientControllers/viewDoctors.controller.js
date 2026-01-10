import Doctor from "../../models/doctor.model.js";


//--------------- GET ALL DOCTORS ---------------
export const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    if (!doctors)
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });

    return res.status(200).json({
      success: true,
      message: "Fetched all doctors",
      users: doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//------------------- VIEW DOCTORS PROFILE -------------------
export const viewDoctorProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      user: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

