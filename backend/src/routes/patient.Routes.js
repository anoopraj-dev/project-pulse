import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile, updatePatientProfile} from "../controllers/patientControllers/profile.controller.js";
import {  updateLifeStyleInfo, updatePersonalInfo, updateMedicalInfo } from '../controllers/patientControllers/onboarding.controller.js'
import { getApprovedDoctors,   viewDoctorProfile } from "../controllers/patientControllers/viewDoctors.controller.js";
import { searchController, searchSuggestionsController } from "../controllers/patientControllers/search.controller.js";
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

//-------------MIDDLEWARES----------
router.use(authenticateUser,authorizeRoles('patient'))

//------------- ROUTES----------------
router.get('/profile', getPatientProfile);
router.post('/personal-info', upload.single('profilePicture'), updatePersonalInfo)
router.post('/medical-info', updateMedicalInfo)
router.post('/lifeStyle-info', updateLifeStyleInfo)
router.post('/file-upload', upload.any(), uploadImage);
router.put('/update-profile', updatePatientProfile);

router.get('/doctors',getApprovedDoctors);
router.get('/doctor/:id',viewDoctorProfile)
router.get('/search',searchController)
router.get('/search/suggestions',searchSuggestionsController)

export default router;
