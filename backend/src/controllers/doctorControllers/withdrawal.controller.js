import { requestWithdrawalService } from "../../services/doctor/withdrawal.service.js";

export const requestWithdrawal = async (req , res) =>{
    try {
        const doctorId = req.user.id;
        const {amount, bankDetails} = req.body;

        const withdrawal = await requestWithdrawalService({
            doctorId,
            amount,
            bankDetails
        });

        

        return res.status(201).json({
            success:true,
            message:'Withdrawal request created',
            data:withdrawal,
        })
    } catch (error) {
        console.error('Withdrawal request error:',error);

        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
};

