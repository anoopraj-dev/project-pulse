import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";
import {personalInfo} from '../controllers/patientControllers/registration.controller.js'
import multer from "multer";

const router = Router();
const upload = multer();


router.get('/profile',authenticateUser,getPatientProfile);
router.post('/registration',authenticateUser,upload.none(),personalInfo)

export default router;
