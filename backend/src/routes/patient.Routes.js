import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";
import {  updateLifeStyleInfo, updatePersonalInfo, updateMedicalInfo } from '../controllers/patientControllers/onboarding.controller.js'
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

//-------------MIDDLEWARES----------
router.use(authenticateUser,authorizeRoles('patient'))

//------------- ROUTES----------------
router.get('/profile', getPatientProfile);
router.post('/personal-info', upload.none(), updatePersonalInfo)
router.post('/medical-info', upload.none(), updateMedicalInfo)
router.post('/lifeStyle-info', upload.none(), updateLifeStyleInfo)
router.post('/file-upload', upload.single('profilePicture'), uploadImage);

export default router;
