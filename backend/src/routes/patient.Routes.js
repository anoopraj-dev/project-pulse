import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile } from "../controllers/patientControllers/profile.controller.js";
import { uploadPicture, updateLifeStyleInfo, updatePersonalInfo, updateMedicalInfo } from '../controllers/patientControllers/onboarding.controller.js'
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";

const router = Router();

router.get('/profile', authenticateUser, getPatientProfile);
router.post('/personal-info', authenticateUser, upload.none(), updatePersonalInfo)
router.post('/medical-info', authenticateUser, upload.none(), updateMedicalInfo)
router.post('/lifeStyle-info', authenticateUser, upload.none(), updateLifeStyleInfo)
router.post('/upload-picture', authenticateUser, upload.single('picture'), uploadPicture)
router.post('/file-upload', authenticateUser, upload.single('profilePicture'), uploadImage);

export default router;
