import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getDoctorProfile } from "../controllers/doctorControllers/profile.controller.js";

const router = Router();

router.get('/profile',authenticateUser,getDoctorProfile);

export default router;
