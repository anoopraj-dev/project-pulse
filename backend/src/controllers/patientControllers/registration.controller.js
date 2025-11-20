import Patient from "../../models/patient.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

export const updatePersonalInfo = async (req, res) => {

  try {
    const { gender, address, phone, dob, work } = req.body;

    const updateData = { gender, address, phone, dob, work };

    const patient = await Patient.findByIdAndUpdate(req.user.id, updateData);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Personal information updated successfully'
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal Server error')
  }

}

export const updateMedicalInfo = async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      allergies = [],
      medicalConditions = [],
      cholesterol,
      bloodPressure,
      sugarLevel,
    } = req.body;

    const medicalData = {
      bloodGroup,
      height,
      weight,
      allergies,
      medicalConditions,
      cholesterol,
      bloodPressure,
      sugarLevel,
    };

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: { medical_history: medicalData } },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }


    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server error" });
  }
};


export const updateLifeStyleInfo = async (req, res) => {
  try {
    const{
      smoking,
      alcohol,
      exerciseFrequency,
      diet = [],
      sleepHours,
      stressLevel,
      waterIntake,
      caffeineIntake,
      physicalActivityType,
      screenTime,
      otherHabits =[]
    } = req.body

    const lifeStyleData = {
      smoking,
      alcohol,
      exerciseFrequency,
      diet,
      sleepHours,
      stressLevel,
      waterIntake,
      caffeineIntake,
      physicalActivityType,
      screenTime,
      otherHabits
    }

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      {$set: { lifestyle_habits: lifeStyleData}},
      {new: true, runValidators: true }
    )

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server error" });
  }
}

//image upload

export const uploadPicture = async (req, res) => {
 
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Choose an image to upload'
      })
    }

    console.log(req.file)
    const response = await uploadToCloudinary(req.file);

    const patient = await Patient.findByIdAndUpdate(req.user.id,
      {
        firstLogin: false,
        profilePicture: response.secure_url
      },
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({
        success: true,
        message: 'Patient not found!'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded succefully'
    })

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error during file upload" });
  }
}


