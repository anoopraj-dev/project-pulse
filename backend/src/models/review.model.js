import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    consultation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Consultation',
        required:true,
        unique:true,
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    review:{
        type:String,
        default:''
    }
},{timestamps:true});

export default mongoose.model('Review',reviewSchema)