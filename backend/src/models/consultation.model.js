import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Appointment',
        required:true,
    },
    patient: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    sessionId: {
        type: String,
        required:true,
        unique: true
    },
    token: {
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum:['scheduled','in-progress','completed','cancelled','disconnected','pending-confirmation'],
        default:'scheduled'
    },
    participants: {
        patient:{
            joinedAt: Date,
            leftAt: Date,
            isPresent: Boolean
        },
        doctor:{
            joinedAt:Date,
            leftAt: Date,
            isPresent: Boolean
        },
    },
    startTime: {
        type: Date
    },
    duration:{
        type: Number,
        default:0
    },
    endTime: {
        type:Date
    },
    tokenExpiresAt: {
        type:Date,
        required:true,
    },
    notes:{
        type:String,
        default:''
    },
    isPrescribed:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

// -------------- Indexes ----------
consultationSchema.index({appointment:1, sessionId:1});
consultationSchema.index({patient:1,doctor:1})

const Consultation = mongoose.model('Consultation',consultationSchema);

export default Consultation;