
import Doctor from '../../models/doctorModels/doctor.model.js'

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
      education =JSON.parse(education)
      updateData["professionalInfo.education"] = education.map(edu => ({
        degree: edu.degree,
        college: edu.college,
        completionYear: edu.completionYear,
        certificate:''
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



export const servicesInfo = async(req,res) => {
  try {
    const {servicesTypes,fees} =req.body;

    const serviceInfo = {
      servicesTypes,
      fees
    }

    const doctor = await Doctor.findByIdAndUpdate(req.user.id, serviceInfo,{new: true});

    if(!doctor){
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
      success:false,
      message: 'Server error'
    })
  }
}