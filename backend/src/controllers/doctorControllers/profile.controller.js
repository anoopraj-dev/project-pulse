import Doctor from "../../models/doctor.model.js";

// ------------- GET PROFILE ----------
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


// --------------- UPDATE PROFILE -----------------

const safeParse = (value) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  return value; 
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const { _id, professionalInfo, services, qualifications, specializations, ...rest } = req.body;

    const updatePayload = { ...rest };

    // Parse services
    if (services) {
      const parsedServices = safeParse(services);
      updatePayload.services = parsedServices
        .map((service, index) => {
          if (!service || service.fees === undefined || service.fees === "") return null;
          return {
            serviceType: index === 0 ? "online" : "offline",
            fees: Number(service.fees),
          };
        })
        .filter(Boolean);
    }

    // Parse qualifications and specializations
    console.log(qualifications, specializations)
    if (qualifications) {
      updatePayload.qualifications = safeParse(qualifications) || [];
    }
    if (specializations) {
      updatePayload.specializations = safeParse(specializations) || [];
    }

    const doctor = await Doctor.findByIdAndUpdate(
      _id,
      { $set: updatePayload },
      { new: true, runValidators: true, context: "query" }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({ success: true, user: doctor });

  } catch (error) {
    console.error("Update doctor profile error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
