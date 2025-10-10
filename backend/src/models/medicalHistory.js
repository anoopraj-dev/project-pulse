import mongoose from "mongoose";

export const medicalSchema = new mongoose.Schema({
    patientId:{
        type: String
    },
    bloodGroup: {
        type: String
    },
    height:{
        type:String
    },
    weight:{
        type: String
    },
    bloodPressure:{
        type: String
    },
    glucoseLevel: {
        type: String
    },
    cholesterol: {
        type: String
    },
    allergies:{
        type: [String]
    },
    medicalConditions:{
        type:[String]
    }
},{_id:false})

