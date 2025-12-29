import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorControllers/profile.controller.js";
import {
  updatePersonalInfo,
  updateProfessionalInfo,
  updateServicesInfo,
} from "../controllers/doctorControllers/onboarding.controller.js";
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

//----------- MIDDLEWARES---------------
router.use(authenticateUser, authorizeRoles("doctor"));

//------------- ROUTES---------------
router.get("/profile", getDoctorProfile);
router.post(
  "/personal-info",
  upload.single("profilePicture"),
  updatePersonalInfo
);
router.post(
  "/professional-info",
  upload.fields([
    { name: 'proofDocument', maxCount:2},
    { name: "experienceCertificate", maxCount: 3 },
    { name: "educationCertificate", maxCount: 3 },
    
  ]),
  updateProfessionalInfo
);

router.post("/services-info", updateServicesInfo);

router.patch("/update-profile", upload.fields([
    { name: 'proofDocument', maxCount:2},
    { name: "experienceCertificate", maxCount: 3 },
    { name: "educationCertificate", maxCount: 3 },
    
  ]),
  updateDoctorProfile);

export default router;
