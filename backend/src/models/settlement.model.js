import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Appointment',
            required:true,
            unique:true,
        },
        doctor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true,
        },
        patient:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Patient',
            required:true
        },
        payment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Payment',
            required:true,
        },
        type: {
            type:String,
            enum:['completed','expired','cancelled'],
            required:true,
        },
        platformFee:{
            type:Number,
            default:0
        },
        doctorPayout:{
            type:Number,
            default:0
        },
        patientRefund:{
            type:Number,
            default:0
        },
        status:{
            type:String,
            enum:['pending','processed','failed'],
            default:'pending'
        },
        processedAt: Date,

    },
    {timestamps:true}
)

export default mongoose.model('Settlement', settlementSchema)