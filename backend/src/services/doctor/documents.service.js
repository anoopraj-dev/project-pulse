import Doctor from "../../models/doctor.model.js";
import mongoose from "mongoose";

export const deleteDoctorDocumentService = async (docId) => {
  if (!mongoose.Types.ObjectId.isValid(docId)) {
    throw new Error("Invalid id");
  }

  const updatedDoctor = await Doctor.findOneAndUpdate(
    {
      $or: [
        { "professionalInfo.education._id": docId },
        { "professionalInfo.experience._id": docId },
      ],
    },
    {
      $pull: {
        "professionalInfo.education": { _id: docId },
        "professionalInfo.experience": { _id: docId },
      },
    },
    {
      new: true,
      select: "-password",
    }
  );

  if (!updatedDoctor) {
    throw new Error("Document not found");
  }

  return updatedDoctor;
};