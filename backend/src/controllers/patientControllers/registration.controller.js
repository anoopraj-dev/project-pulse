import Patient from "../../models/patient.model.js";

export const personalInfo = async (req,res) => {
    
    try{
       const {email,gender,address,phone,dob,work } = req.body;
    
       const updateData = {gender,address,phone,dob,work};

       const patient = await Patient.findOneAndUpdate({email},updateData);

       if(!patient){
        return res.status(404).json({
            success:false,
            message:'Patient not found'
        })
       }
       console.log(patient)
       return res.status(200).json({
        success: true,
        message: 'Personal information updated successfully'
       })

       
    }catch(error){
        console.log(error);
        return res.status(500).json('Internal Server error')
    }

}

