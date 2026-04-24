import mongoose, { Schema,model } from "mongoose";

const AdminSchema = new Schema({
    email: {
        type: String,
        unique:true,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default:'admin'
    }
},{timestamps:true});


const Admin = model('Admin', AdminSchema);

export default Admin;