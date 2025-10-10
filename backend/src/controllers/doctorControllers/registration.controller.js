
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



export const professionalInfo = async (req, res) => {
  try {
    const { email } = req.body;
    let { qualifications, specializations, experienceYears, experience, education } = req.body;

 
    if (typeof experience === "string") {
      experience = JSON.parse(experience);
    }
    if (typeof education === "string") {
      education = JSON.parse(education);
    }

 
    if (Array.isArray(education)) {
      education = education.map((item) => ({
        ...item,
        certificate: typeof item.certificate === "object" ? "" : item.certificate || ""
      }));
    }

   
    experienceYears = Number(experienceYears) || 0;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.qualifications = qualifications;
    doctor.specializations = specializations;
    doctor.experienceYears = experienceYears;
    doctor.experience = experience;
    doctor.education = education;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Professional info saved successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};