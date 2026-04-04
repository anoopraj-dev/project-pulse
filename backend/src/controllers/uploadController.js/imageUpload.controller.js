
import { handleImageUpload } from "../../services/uploads/imageUpload.service.js";

export const uploadImage = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const type = req.query.type || req.body.type;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Upload type missing",
      });
    }

    const { urls, updatedDoc } = await handleImageUpload({
      files,
      type,
      user: req.user,
    });

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      uploadedCount: urls.length,
      urls,
      user: updatedDoc,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error during file upload",
    });
  }
};