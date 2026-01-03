import { Router } from "express";
import { authenticateUser} from "../middlewares/authenticateUser.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { approveDoctorsRequest, getAdminDashboard, getDoctorDocuments, getPendingDoctorProfile, rejectDoctorsRequest } from "../controllers/adminControllers/adminDashboard.controller.js";
const router = Router();

//-------------MIDDLEWARES -----------
router.use(authenticateUser,authorizeRoles('admin'))

//--------------ROUTES-------------
router.get('/dashboard',getAdminDashboard)
router.get('/doctor/:id',getPendingDoctorProfile)
router.get('/doctor/:id/documents', getDoctorDocuments)
router.patch('/doctor/approve/:id',approveDoctorsRequest)
router.patch('/doctor/reject/:id',rejectDoctorsRequest)
export default router;