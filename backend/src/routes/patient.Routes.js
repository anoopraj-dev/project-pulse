import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";

const router = Router();


router.get('/profile',authenticateUser,getPatientProfile);
router.post('/patient/registration',authenticateUser,)

export default router;
