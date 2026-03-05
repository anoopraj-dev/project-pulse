import Wallet from '../../models/wallet.model.js'
import Transaction from '../../models/transaction.model.js'
import mongoose from 'mongoose'
import Appointment from '../../models/appointments.model.js'

//----------- Get patients Wallet and transactions ------------
export const getPatientWallet = async(req , res) =>{
    try {
        const {id:patientId} = req.user;

        let wallet = await Wallet.findOne({ userId: patientId, role: "patient" })
        const transactions = (await Transaction.find({ wallet: wallet._id }))
  .sort((a, b) => b.createdAt - a.createdAt);

        if(!wallet){
            wallet = await Wallet.create({userId:patientId,role:'patient', balance:0, transactions:[]})
        }

        res.json({
            success:true,
            wallet,
            transactions
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Failed to fetch wallet info'
        })
    }
}

//---------------- Refund controller -----------------
export const refundToWallet = async(req,res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {id:patientId} = req.user;
        const {appointmentId,amount} = req.body;

        if(!appointmentId || !amount || amount<=0){
            throw new Error('Invalid refund details')
        }

        //----------- Check if appointment exists ----------
        const appointment = await Appointment.findById(appointmentId);
        if(!appointment){
            throw new Error('Appointment not found for this patient');
        }

        //------------ Get / create Wallet ---------------
        let wallet = await Wallet.findOne({userId:patientId,role:'patient'}).session(session);

        if(!wallet){
            wallet = await Wallet.create([{userId:patientId,role:'patient', balance:0}],{session})
            wallet = wallet[0];
        }

        //------------- Create a transaction ---------------
        const transaction = await Transaction.create([{
            wallet:wallet._id,
            type:'credit',
            amount,
            referenceType:'refund',
            referenceId:appointment._id,
            notes:`Refund for cancelled appointment ${appointment._id}`
        }],{session});

        //------------- Update Wallet and push transaction -------------
        wallet.balance+=amount;
        wallet.transactions.push(transaction[0]._id);
        await wallet.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success:true,
            message:'Refund credited to wallet',
            wallet,
            transaction:transaction[0]
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(400).json({
            success:false,
            message:error.message || 'Refund failed'
        })
    }
}