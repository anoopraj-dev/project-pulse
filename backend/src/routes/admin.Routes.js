import { Router } from "express";
import { authenticateUser} from "../middlewares/authenticateUser.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { approveDoctorsRequest, getAdminDashboard, getPendingDoctorProfile, rejectDoctorsRequest } from "../controllers/adminControllers/adminDashboard.controller.js";
const router = Router();

//-------------MIDDLEWARES -----------
router.use(authenticateUser,authorizeRoles('admin'))

//--------------ROUTES-------------
router.get('/dashboard',getAdminDashboard)
router.get('/doctor/:id',getPendingDoctorProfile)
router.post('/doctor/approve/:id', approveDoctorsRequest)
router.delete('/doctor/reject/:id',rejectDoctorsRequest)
export default router;