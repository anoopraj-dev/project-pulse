import Patient from "../../models/patient.model.js";

// -------- GET PATIENT PROFILE SERVICE --------
export const getPatientProfileService = async (user) => {
  if (!user || user.role !== "patient") {
    throw new Error("Not authorized");
  }

  const patient = await Patient.findById(user.id).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

// -------- UPDATE PATIENT PROFILE SERVICE --------
export const updatePatientProfileService = async (userId, body, file) => {
  const updatedData = { ...body };

  if (file) {
    updatedData.profilePicture = file.path;
  }

  // remove empty fields
  Object.keys(updatedData).forEach((key) => {
    if (
      updatedData[key] === undefined ||
      updatedData[key] === null ||
      updatedData[key] === ""
    ) {
      delete updatedData[key];
    }
  });

  const patient = await Patient.findByIdAndUpdate(
    userId,
    { $set: updatedData },
    { new: true }
  ).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};