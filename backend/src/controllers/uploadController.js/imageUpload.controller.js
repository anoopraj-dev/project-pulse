import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

// ----------- Helper (resolve upload type)-------------
const resolveUploadType = (role, type) =>
  `${role}${type.charAt(0).toUpperCase()}${type.slice(1)}`;


//----------------------- UPLOAD IMAGE CONTROLLER -------------------
export const uploadImage = async (req, res) => {
  try {
    console.log("FILES FROM FRONTEND:", req.files);

    const files = req.files || [];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const type = req.query.type || req.body.type;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Upload type missing",
      });
    }

    const role = req.user.role;
    const uploadType = resolveUploadType(role, type);
    const normalizedFiles = Array.isArray(files) ? files : [files];
    const uploaded = [];

    for (const file of normalizedFiles) {
      const result = await uploadToCloudinary(file);
      uploaded.push(result);
    }

    const urls = uploaded.map((r) => r.secure_url);
    let updatedDoc;

    switch (uploadType) {
      // ---------- SINGLE ----------
      case "patientProfilePicture":
        updatedDoc = await Patient.findByIdAndUpdate(
          req.user.id,
          { profilePicture: urls[0] },
          { new: true }
        );
        break;

      case "doctorProfilePicture":
        updatedDoc = await Doctor.findByIdAndUpdate(
          req.user.id,
          { profilePicture: urls[0] },
          { new: true }
        );
        break;

      // ---------- MULTIPLE ----------
      case "doctorProofDocument":
        updatedDoc = await Doctor.findByIdAndUpdate(
          req.user.id,
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

      case 'doctorExperienceCertificate':
        updatedDoc = await Doctor.findByIdAndUpdate(
          req.user.id,
          {
            $push: {
              "professionalInfo.experience.3.experienceCertificate":{
                $each: urls,
              }
            }
          },
          {new: true}
        );
        break;

        case 'doctorEducationCertificate':
        updatedDoc = await Doctor.findByIdAndUpdate(
          req.user.id,
          {
            $push: {
              "professionalInfo.education.3.educationCertificate":{
                $each: urls,
              }
            }
          },
          {new: true}
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid upload type",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      uploadedCount: urls.length,
      urls,
      user: updatedDoc,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during file upload",
    });
  }
};
