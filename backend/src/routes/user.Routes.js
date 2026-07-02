import { Router } from "express";
import { updatePaymentStatus } from "../controllers/paymentControllers/payment.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getApprovedDoctors } from "../controllers/patientControllers/viewDoctors.controller.js";
import { homepageStatsController } from "../controllers/userControllers/homePage.controller.js";
import { getPublicReviewsController } from "../controllers/userControllers/review.controller.js";

const router = Router();

router.get('/payments/update-status',authenticateUser,updatePaymentStatus)
router.get('/doctors/approved',getApprovedDoctors)
router.get('/home/stats',homepageStatsController)
router.get('/home/reviews',getPublicReviewsController)

export default router