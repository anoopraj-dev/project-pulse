import Patient from "../../models/patient.model.js";

export const personalInfo = async (req, res) => {

    try {
        const { gender, address, phone, dob, work,firstLogin} = req.body;

        const updateData = { gender, address, phone, dob, work,firstLogin:false};

        const patient = await Patient.findOneAndUpdate({ id:req.user.id}, updateData);

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
      { id:req.user.id },
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


