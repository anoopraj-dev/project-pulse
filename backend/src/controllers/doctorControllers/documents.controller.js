import { deleteDoctorDocumentService } from "../../services/doctor/documents.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const deleteDocuments = asyncHandler(async (req, res) => {
  const updatedDoctor = await deleteDoctorDocumentService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Document deleted successfully",
    user: updatedDoctor,
  });
});