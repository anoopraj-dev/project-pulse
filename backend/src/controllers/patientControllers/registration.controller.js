import Patient from "../../models/patient.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

export const personalInfo = async (req, res) => {

    try {
        const { gender, address, phone, dob, work} = req.body;

        const updateData = { gender, address, phone, dob, work};

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

export const medicalInfo = async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      allergies =[],
      medicalConditions=[],
      cholesterolLevel,
      bloodPressure,
      glucoseLevel,
      work
    } = req.body;

    const medicalData = {
      bloodGroup,
      height,
      weight,
      allergies,
      medicalConditions,
      cholesterolLevel,
      bloodPressure,
      glucoseLevel,
      work
    };

    const patient = await Patient.findByIdAndUpdate(
       req.user.id ,
      { $set:{medical_history: medicalData}},
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

//image upload

export const uploadPicture = async (req,res)=>{
  try {
    if(!req.file){
      return res.status(400).json({
        success:false,
        message:'No file uploaded'
      })
    }

    console.log(req.file)
    const response = await uploadToCloudinary(req.file);

    const patient = await Patient.findByIdAndUpdate(req.user.id,{firstLogin:false},
      {$set: {profilePicture:response.secure_url}},
      {new: true,runValidators:true}
    );
    if(!patient){
      return res.status(404).json({
        success: true,
        message:''
      })
    }

    return res.status(200).json({
      success: true,
      message:'Profile picture uploaded succefully'
    })

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error during file upload" });
  }
}


