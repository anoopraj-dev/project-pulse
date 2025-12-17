import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getDoctorProfile } from "../controllers/doctorControllers/profile.controller.js";
import {updatePersonlInfo,updateProfessionalInfo, updateServicesInfo} from '../controllers/doctorControllers/onboarding.controller.js'
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

//----------- MIDDLEWARES---------------
router.use(authenticateUser,authorizeRoles('doctor'))

//------------- ROUTES---------------
router.get('/profile',getDoctorProfile);
router.post('/personal-info',updatePersonlInfo);
router.post('/professional-info',updateProfessionalInfo);
router.post('/services-info',updateServicesInfo);
router.post ('/file-upload', upload.any(), uploadImage) ;



export default router;
