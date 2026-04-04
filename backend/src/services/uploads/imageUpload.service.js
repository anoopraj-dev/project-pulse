import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

// ----------- Helper -------------
const resolveUploadType = (role, type) =>
  `${role}${type.charAt(0).toUpperCase()}${type.slice(1)}`;

export const handleImageUpload = async ({ files, type, user }) => {
  const role = user.role;
  const uploadType = resolveUploadType(role, type);

  const normalizedFiles = Array.isArray(files) ? files : [files];

  // -------- Upload to Cloudinary --------
  const uploaded = [];
  for (const file of normalizedFiles) {
    const result = await uploadToCloudinary(file);
    uploaded.push(result);
  }

  const urls = uploaded.map((r) => r.secure_url);
  let updatedDoc;

  // -------- Business Logic --------
  switch (uploadType) {
    case "patientProfilePicture":
      updatedDoc = await Patient.findByIdAndUpdate(
        user.id,
        { $set: { profilePicture: urls[0] } },
        { new: true }
      );
      break;

    case "doctorProfilePicture":
      updatedDoc = await Doctor.findByIdAndUpdate(
        user.id,
        { $set: { profilePicture: urls[0] } },
        { new: true }
      );
      break;

    case "doctorProofDocument":
      updatedDoc = await Doctor.findByIdAndUpdate(
        user.id,
        {
          $push: {
            "professionalInfo.medicalLicense.proofDocument": {
              $each: urls,
            },
          },
        },
        { new: true }
      );
      break;

    case "doctorExperienceCertificate":
      updatedDoc = await Doctor.findByIdAndUpdate(
        user.id,
        {
          $set: {
            "professionalInfo.experience.experienceCertificate": urls[0],
          },
        },
        { new: true }
      );
      break;

    case "doctorEducationCertificate":
      updatedDoc = await Doctor.findByIdAndUpdate(
        user.id,
        {
          $set: {
            "professionalInfo.education.3.educationCertificate": urls[0],
          },
        },
        { new: true }
      );
      break;

    default:
      throw new Error("Invalid upload type");
  }

  return {
    urls,
    updatedDoc,
  };
};