
import Doctor from '../../models/doctorModels/doctor.model.js'
import { uploadToCloudinary } from '../../utils/cloudinaryUtility.js';

export const registerDoctor = async (req, res) => {


  try {
    const { gender, phone, dob, clinicName, clinicAddress, about, location } = req.body;
    const personalInfo = {
      gender,
      phone,
      dob,
      clinicName,
      clinicAddress,
      location,
      about
    }


    const doctor = await Doctor.findByIdAndUpdate(req.user.id, personalInfo, { new: true });


    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found!'

      })
    }

    res.status(200).json({
      success: true,
      message: 'Personal information updated succesfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }


}




export const updateProfessionalInfo = async (req, res) => {
  try {
    let { qualifications, specializations, experience, education } = req.body;

    // --- Validation ---
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // --- Build update object dynamically ---
    const updateData = {};

    if (qualifications) updateData["professionalInfo.qualifications"] = qualifications;
    if (specializations) updateData["professionalInfo.specializations"] = specializations;

    if (experience) {
      experience = JSON.parse(experience)
      updateData["professionalInfo.experience"] = experience.map(exp => ({
        years: exp.years,
        hospitalName: exp.hospital || exp.hospitalName,
        location: exp.location
      }));
    }

    if (education) {
      education = JSON.parse(education)
      updateData["professionalInfo.education"] = education.map(edu => ({
        degree: edu.degree,
        college: edu.college,
        completionYear: edu.completionYear,
        certificate: ''
      }));
    }

    // --- Update doctor record ---
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // --- Response ---
    return res.status(200).json({
      success: true,
      message: "Professional information updated successfully",
      data: updatedDoctor.professionalInfo
    });

  } catch (error) {
    console.error("Error updating professional info:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating professional info",
      error: error.message
    });
  }
};



export const servicesInfo = async (req, res) => {
  try {
    const { servicesTypes, fees } = req.body;

    const serviceInfo = {
      servicesTypes,
      fees
    }

    const doctor = await Doctor.findByIdAndUpdate(req.user.id, serviceInfo, { new: true });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found!'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Service info updated successfully'
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

export const uploadPicture = async (req, res) => {
  try {
    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Choose an image to upload'
      })
    }

    console.log(req.file);
    const response = await uploadToCloudinary(req.file);
    const doctor = await Doctor.findByIdAndUpdate(req.user.id, {
      profilePicture: response.secure_url
    },
      { new: true, runValidators: true }
    )

    if(!doctor){
      return res.status(404).json({
        success: false,
        message: 'Doctor not found!'
      })
    }

    return res.status(200).json({
      success: true,
      message:'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error',error);
    res.status(500).json({
      success:false,
      message:'Server error during file uploaded'
    })
  }
}

export const uploadHandler = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Extract the upload type from query or body
    const uploadType = req.query.type || req.body.type;

    const uploadResults = [];

    for (const file of req.files) {
      console.log(file)
      const response = await uploadToCloudinary(file);
      uploadResults.push({ fieldname: file.fieldname, url: response.secure_url });
    }

    // Dynamically update DB based on uploadType or file.fieldname
    let updatedDoc;
    console.log(uploadType)
    if (uploadType === 'profilePicture') {
      updatedDoc = await Doctor.findByIdAndUpdate(req.user.id, 
        { profilePicture: uploadResults[0].url }, 
        { new: true }
      );
    } else if (uploadType === 'experienceCertificate') {
      const index = parseInt(req.query.index || req.body.index, 10);
      const fieldToUpdate = `professionalInfo.experience.${index}.experienceCertificate`;
      updatedDoc = await Doctor.findByIdAndUpdate(req.user.id, 
        { $set:{[fieldToUpdate]:uploadResults[0].url}},
        {new: true}
      )

      console.log('updated document',updatedDoc)
    } else if (uploadType === 'educationDocument') {
      // update education documents
    } else {
       return res.status(400).json({ success: false, message: 'Invalid upload type' });
    }

    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: updatedDoc ?? uploadResults
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};
