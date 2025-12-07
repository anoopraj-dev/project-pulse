import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import {uploadToCloudinary} from "../../utils/cloudinaryUtility.js";

//-------FILE UPLOAD CONTROLLER-------//

const uploadSingleFile = async (req, res) => {
    const response = await uploadToCloudinary(req.file);
    return response.secure_url;
}

export const uploadImage = async (req, res) => {

    try{
        if(!req.file) {
            return res.status(400).json({success: false, message: "No files uploaded"});
        }

        const uploadResults = [];

        const imageUrl = await uploadSingleFile (req, res);
        uploadResults.push({fieldname: req.file.fieldname, imageUrl});
        const type = req.query.type || req.body.type;
        const role = req.user.role;
        const uploadType = `${role}${type.charAt(0).toUpperCase() + type.slice(1)}`;
        console.log("Upload type determined: ", uploadType);
        let updatedDoc;

        //---------- Dynamically update DB based on upload type ----------//

        switch(uploadType){
            case 'patientProfilePicture':
                updatedDoc = await Patient.findByIdAndUpdate(
                    req.user.id,
                    {profilePicture: uploadResults[0].imageUrl},
                    {new: true  }
                );
                break;
            case 'doctorProfilePicture':
                updatedDoc = await Doctor.findByIdAndUpdate(
                    req.user.id,
                    {profilePicture: uploadResults[0].imageUrl},
                    {new: true}
                );
                break;
            default:
                return res.status(400).json({success: false, message: "Invalid upload type"});
        }

        return res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            imageUrl: uploadResults[0].imageUrl,
            user: updatedDoc
        });

    }catch(error){
        console.log("Error during file upload: ", error);
        return res.status(500).json({success: false, message: "Server error during file upload"});
    }
}