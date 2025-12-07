import Doctor from "../../models/doctorModels/doctor.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

//-------DOCTOR ONBOARDING CONTROLLERS-------//

//-------- PERSONAL INFO -------//

export const updatePersonlInfo = async (req, res) => {
  try {
    const { gender, phone, dob, clinicName, clinicAddress, about, location } =
      req.body;
    const personalInfo = {
      gender,
      phone,
      dob,
      clinicName,
      clinicAddress,
      location,
      about,
    };

    const doctor = await Doctor.findByIdAndUpdate(req.user.id, personalInfo, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Personal information updated succesfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//------- PROFESSIONAL INFO  ( qualification/ education / specialization/ liscence)-------//
export const updateProfessionalInfo = async (req, res) => {
  try {
    let {
      qualifications,
      specializations,
      experience,
      education,
      registrationNumber,
      stateCouncil,
      yearOfRegistration,
      liscenceProof,
    } = req.body;

    // --- Validation ---
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    // --- Build update object dynamically ---
    const updateData = {};

    if (qualifications)
      updateData["professionalInfo.qualifications"] = qualifications;
    if (specializations)
      updateData["professionalInfo.specializations"] = specializations;

    if (experience) {
      experience = JSON.parse(experience);
      updateData["professionalInfo.experience"] = experience.map((exp) => ({
        years: exp.years,
        hospitalName: exp.hospital || exp.hospitalName,
        location: exp.location,
      }));
    }

    if (education) {
      education = JSON.parse(education);
      updateData["professionalInfo.education"] = education.map((edu) => ({
        degree: edu.degree,
        college: edu.college,
        completionYear: edu.completionYear,
        certificate: "",
      }));
    }

    if (
      registrationNumber ||
      stateCouncil ||
      yearOfRegistration ||
      liscenceProof
    ) {
      updateData["professionalInfo.medicalLicense"] = {
        registrationNumber: registrationNumber || "",
        stateCouncil: stateCouncil || "",
        yearOfRegistration: Number(yearOfRegistration) || 2024,
        liscenceProof: liscenceProof || "",
      };
    }

    // --- Update doctor record ---
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // --- Response ---
    return res.status(200).json({
      success: true,
      message: "Professional information updated successfully",
      data: updatedDoctor.professionalInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating professional info",
      error: error.message,
    });
  }
};

//------- SERVICE INFO ( online/ offline consultation)-------//

export const updateServicesInfo = async (req, res) => {
  try {
    const { services, online_fee, offline_fee } = req.body;

    let servicesArray = [];

    // services come as ["online","offline"]
    const parsedServices = JSON.parse(services);

    if (parsedServices.includes("online")) {
      servicesArray.push({
        serviceType: "online",
        fees: Number(online_fee),
      });
    }

    if (parsedServices.includes("offline")) {
      servicesArray.push({
        serviceType: "offline",
        fees: Number(offline_fee),
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { services: servicesArray },
      { new: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Service info updated successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

