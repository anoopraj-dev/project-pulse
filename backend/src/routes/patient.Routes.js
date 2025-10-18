import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";
import {personalInfo,medicalInfo, uploadPicture} from '../controllers/patientControllers/registration.controller.js'
import upload from "../config/multer.js";

const router = Router();

router.get('/profile',authenticateUser,getPatientProfile);
router.post('/personal-info',authenticateUser,upload.none(),personalInfo)
router.post('/medical-info',authenticateUser,upload.none(),medicalInfo)
router.post('/upload-picture',authenticateUser,upload.single('picture'),uploadPicture)

export default router;
