import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        doctor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true,
        },
        amount:{
            type: Number,
            required:true,
        },
        status:{
            type:String,
            enum:['pending','processing','processed','failed'],
            default:'pending'
        },
        bankDetails:{
            accountNumber: String,
            ifsc:String,
            name:String,
        },
        razorpayPayoutId: String,
        failureReason: String,

        processedAt: Date,
    },{ timeseries:true}
)

export default mongoose.model('Withdrawal',withdrawalSchema);