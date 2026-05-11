
import { handleImageUpload } from "../../services/uploads/imageUpload.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const files = req.files || [];

  if (!files || files.length === 0) throw new AppError("No files uploaded", 400);

  const type = req.query.type || req.body.type;
  if (!type) throw new AppError("Upload type missing", 400);

  const { urls, updatedDoc } = await handleImageUpload({ files, type, user: req.user });

  return res.status(200).json({
    success: true,
    message: "Upload successful",
    uploadedCount: urls.length,
    urls,
    user: updatedDoc,
  });
});