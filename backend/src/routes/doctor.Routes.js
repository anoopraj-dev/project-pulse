import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getDoctorProfile } from "../controllers/doctorControllers/profile.controller.js";
import {registerDoctor,updateProfessionalInfo, servicesInfo, uploadPicture,uploadHandler} from '../controllers/doctorControllers/registration.controller.js'
import upload from "../config/multer.js";

const router = Router();

router.get('/profile',authenticateUser,getDoctorProfile);
router.post('/personal-info',authenticateUser,upload.none(),registerDoctor);
router.post('/professional-info',authenticateUser,upload.none(),updateProfessionalInfo);
router.post('/services-info',authenticateUser,servicesInfo);
router.post('/upload-picture',authenticateUser,upload.single('profilePicture'),uploadPicture);
router.post ('/file-upload', authenticateUser, upload.any(),uploadHandler)
export default router;
