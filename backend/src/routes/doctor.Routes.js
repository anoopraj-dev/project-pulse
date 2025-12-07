import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getDoctorProfile } from "../controllers/doctorControllers/profile.controller.js";
import {updatePersonlInfo,updateProfessionalInfo, updateServicesInfo} from '../controllers/doctorControllers/onboarding.controller.js'
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";

const router = Router();

router.get('/profile',authenticateUser,getDoctorProfile);
router.post('/personal-info',authenticateUser,updatePersonlInfo);
router.post('/professional-info',authenticateUser,updateProfessionalInfo);
router.post('/services-info',authenticateUser,updateServicesInfo);
router.post ('/file-upload', authenticateUser,upload.single('profilePicture'),  uploadImage) ;


export default router;
