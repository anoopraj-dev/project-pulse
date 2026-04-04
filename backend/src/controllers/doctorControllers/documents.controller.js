
import { deleteDoctorDocumentService } from "../../services/doctor/documents.service.js";

export const deleteDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDoctor = await deleteDoctorDocumentService(id);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      user: updatedDoctor,
    });
  } catch (error) {
    console.error("deleteDocuments error:", error);

    return res.status(
      error.message === "Invalid id" ? 400 :
      error.message === "Document not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};