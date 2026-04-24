import { Router } from "express";
import { updatePaymentStatus } from "../controllers/paymentControllers/payment.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getApprovedDoctors } from "../controllers/patientControllers/viewDoctors.controller.js";
import { homepageStatsController } from "../controllers/userControllers/homePage.controller.js";

const router = Router();

router.get('/payments/update-status',authenticateUser,updatePaymentStatus)
router.get('/doctors/approved',getApprovedDoctors)
router.get('/home/stats',homepageStatsController)

export default router