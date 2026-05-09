import { submitReviewService } from "../../services/user/review.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const submitReviewController = asyncHandler(async (req, res) => {
  const consultationId = req.params.id;
  const patientId = req.user.id;
  const { rating, review } = req.body;

  if (!rating) throw new AppError("Rating is required", 400);

  const reviewDoc = await submitReviewService({ consultationId, patientId, rating, review });

  return res.status(200).json({
    success: true,
    message: "Review submitted successfully",
    data: reviewDoc,
  });
});