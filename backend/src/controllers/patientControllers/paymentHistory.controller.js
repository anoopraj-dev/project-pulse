import Payment from "../../models/payments.model.js";

//----------------- Payment history for patient -----------------
export const getPatientPaymentHistory = async(req,res)=>{
    try {
        const patientId = req.user.id;

        const payments = await Payment.find({patient: patientId})
            .populate('doctor', ' name profilePicture professionalInfo.specializations')
            .populate('appointment', 'appointmentDate timeSlot serviceType status')
            .sort({createdAt: -1 })

            res.status(200).json({success: true, payments});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Server error'
        })
        
    }
}

