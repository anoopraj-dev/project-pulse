import dotenv from 'dotenv'
dotenv.config();
import cloudinary  from "../config/cloudinary.js";
import streamifier from  'streamifier'

export const uploadToCloudinary = async(file,folder='pulse360') => {
    return new Promise((resolve,reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {folder:'pulse360'},
            (error,result) => {
                if(error) reject(error);
                else resolve(result)
            }
        )

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    })

}