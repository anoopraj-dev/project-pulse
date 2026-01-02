import Doctor from "../../models/doctor.model.js";
import mongoose from "mongoose";

export const deleteDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      {
        $or: [
          { "professionalInfo.education._id": id },
          { "professionalInfo.experience._id": id }
        ]
      },
      {
        $pull: {
          "professionalInfo.education": { _id: id },
          "professionalInfo.experience": { _id: id }
        }
      },{
        new: true,
        select: '-password'
      }
    );

    if (!updatedDoctor) {
        
      return res.status(404).json({ success: false, message: "Document not found" });
    }
 
    return res.json({ success: true, message: "Document deleted successfully" ,user: updatedDoctor});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
