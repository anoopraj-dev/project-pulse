import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    title:String,
    description:String,
    severity:{
        type:String,
        enum:['low','medium','high','critical'],
    },
    service: String,
    status:{
        type:String,
        default:'active'
    },
    fingerprint: String,
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

export default mongoose.model('Alert',alertSchema);