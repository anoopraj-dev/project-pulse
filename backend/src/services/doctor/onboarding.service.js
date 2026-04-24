import Doctor from "../../models/doctor.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

// -------- PERSONAL INFO --------
export const updatePersonalInfoService = async (doctorId, body, file) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  let profilePictureUrl = doctor.profilePicture || "";

  if (file) {
    const uploaded = await uploadToCloudinary(file);
    profilePictureUrl = uploaded.secure_url;
  }

  const updateData = {
    gender: body.gender,
    phone: body.phone,
    dob: body.dob,
    clinicName: body.clinicName,
    clinicAddress: body.clinicAddress,
    about: body.about,
    location: body.location,
    profilePicture: profilePictureUrl,
  };

  return await Doctor.findByIdAndUpdate(
    doctorId,
    { $set: updateData },
    { new: true }
  );
};

// -------- PROFESSIONAL INFO --------
export const updateProfessionalInfoService = async (
  doctorId,
  body,
  files
) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  let {
    qualifications,
    specializations,
    experience,
    education,
    registrationNumber,
    stateCouncil,
    yearOfRegistration,
    mode = "replace",
  } = body;

  const setData = {};
  const pushData = {};

  // Basic info
  if (qualifications)
    setData["professionalInfo.qualifications"] = qualifications;

  if (specializations)
    setData["professionalInfo.specializations"] = specializations;

  // License
  if (files?.proofDocument?.length > 0) {
    const uploadedProofs = await Promise.all(
      files.proofDocument.map((file) =>
        uploadToCloudinary(file).then((r) => r.secure_url)
      )
    );

    setData["professionalInfo.medicalLicense"] = {
      registrationNumber: registrationNumber || "",
      stateCouncil: stateCouncil || "",
      yearOfRegistration: Number(yearOfRegistration) || null,
      proofDocument: uploadedProofs,
    };
  }

  // Experience
  if (experience) {
    const parsed =
      typeof experience === "string" ? JSON.parse(experience) : experience;

    const expFiles = files?.experienceCertificate || [];

    const prepared = await Promise.all(
      parsed.map(async (exp, i) => ({
        years: Number(exp.years) || 0,
        hospitalName: exp.hospital || "",
        location: exp.location || "",
        experienceCertificate: expFiles[i]
          ? (await uploadToCloudinary(expFiles[i])).secure_url
          : "",
      }))
    );

    if (mode === "append") {
      pushData["professionalInfo.experience"] = { $each: prepared };
    } else {
      setData["professionalInfo.experience"] = prepared;
    }
  }

  // Education
  if (education) {
    const parsed =
      typeof education === "string" ? JSON.parse(education) : education;

    const eduFiles = files?.educationCertificate || [];

    const prepared = await Promise.all(
      parsed.map(async (edu, i) => ({
        degree: edu.degree || "",
        college: edu.college || "",
        completionYear: Number(edu.completionYear) || 0,
        educationCertificate: eduFiles[i]
          ? (await uploadToCloudinary(eduFiles[i])).secure_url
          : "",
      }))
    );

    if (mode === "append") {
      pushData["professionalInfo.education"] = { $each: prepared };
    } else {
      setData["professionalInfo.education"] = prepared;
    }
  }

  const updateQuery = {};
  if (Object.keys(setData).length) updateQuery.$set = setData;
  if (Object.keys(pushData).length) updateQuery.$push = pushData;

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    doctorId,
    updateQuery,
    { new: true }
  ).select("-password");

  return updatedDoctor.professionalInfo;
};

// -------- SERVICES INFO --------
export const updateServicesInfoService = async (doctorId, services) => {
  if (!services) throw new Error("Services data missing");

  let parsedServices;

  try {
    parsedServices =
      typeof services === "string" ? JSON.parse(services) : services;
  } catch {
    throw new Error("Invalid services format");
  }

  if (!Array.isArray(parsedServices)) {
    throw new Error("Services must be an array");
  }

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      $set: {
        services: parsedServices,
        firstLogin: false,
      },
    },
    { new: true }
  ).select("-password");

  if (!doctor) throw new Error("Doctor not found");

  return doctor;
};