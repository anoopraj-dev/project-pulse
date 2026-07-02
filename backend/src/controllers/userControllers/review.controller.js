import { submitReviewService } from "../../services/user/review.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import Review from "../../models/review.model.js";

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

export const getPublicReviewsController = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("patient", "name profilePicture")
    .sort({ createdAt: -1 })
    .limit(8);

  return res.status(200).json({
    success: true,
    data: reviews,
  });
});