import { Router } from "express";
import { updatePaymentStatus } from "../controllers/paymentControllers/payment.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = Router();

router.get('/payments/update-status',authenticateUser,updatePaymentStatus)

export default router