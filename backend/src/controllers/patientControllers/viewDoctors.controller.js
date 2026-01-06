import Doctor from "../../models/doctor.model.js";

export const getApprovedDoctors = async (req,res)=>{
    try {
        const doctors = await Doctor.find();

        if(!doctors) return res.status(404).json({
            success: false, 
            message: 'Data not found'
        });

        return res.status(200).json({
            success:true, 
            message:'Fetched all doctors', 
            users : doctors
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: 'Internal server error'
        })
    }

}