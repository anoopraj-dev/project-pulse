import mongoose from "mongoose";

const SystemAlertSchema = new mongoose.Schema(
    {
        title:String,
        message:String,

        severity:{
            type:String,
            enum:['low','medium','high','critical'],
            default:'medium'
        },
        source:{
            type:String,
            enum:['system','payment','auth','server','cron'],
        },
        status:{
            type:String,
            enum:['active','acknowledged','resolved'],
            default:'active'
        },
        metadata:Object
    },
    {timestamps:true}
)
SystemAlertSchema.index({ status: 1, severity: 1, createdAt: -1 });
export default mongoose.model('SystemAlert',SystemAlertSchema)