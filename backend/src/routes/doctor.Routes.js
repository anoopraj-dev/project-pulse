import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getDoctorProfile } from "../controllers/doctorControllers/profile.controller.js";
import {registerDoctor,professionalInfo} from '../controllers/doctorControllers/registration.controller.js'
import multer from "multer";

const upload = multer();
const router = Router();

router.get('/profile',authenticateUser,getDoctorProfile);
router.post('/personal-info',authenticateUser,upload.none(),registerDoctor);
router.post('/professional-info',authenticateUser,upload.none(),professionalInfo)
export default router;
