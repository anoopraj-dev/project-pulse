import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";
import {personalInfo,medicalInfo} from '../controllers/patientControllers/registration.controller.js'
import multer from "multer";

const router = Router();
const upload = multer();


router.get('/profile',authenticateUser,getPatientProfile);
router.post('/personal-info',authenticateUser,upload.none(),personalInfo)
router.post('/medical-info',authenticateUser,upload.none(),medicalInfo)
export default router;
