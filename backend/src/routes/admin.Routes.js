import { Router } from "express";
import { authenticateUser} from "../middlewares/authenticateUser.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { approveDoctorsRequest, getAdminDashboard, getAllDoctors, getDoctorDocuments, getPendingDoctorProfile, rejectDoctorsRequest,blockDoctorProfile, revokeDoctorStatus, unblockDoctorProfile, getAdminNotifications } from "../controllers/adminControllers/adminDashboard.controller.js";
import { blockPatientProfile, getAllPatients, getPatientProfile, unblockPatientProfile } from "../controllers/adminControllers/adminViewPatients.controller.js";
import { searchController, searchSuggestionsController } from "../controllers/adminControllers/search.controller.js";
import { setMarkAllRead } from "../controllers/adminControllers/adminDashboard.controller.js";
const router = Router();

//-------------MIDDLEWARES -----------
router.use(authenticateUser,authorizeRoles('admin'))

//--------------ROUTES-------------
router.get('/dashboard',getAdminDashboard)
router.get('/doctor/:id',getPendingDoctorProfile)
router.get('/doctor/:id/documents', getDoctorDocuments)
router.patch('/doctor/approve/:id',approveDoctorsRequest)
router.patch('/doctor/reject/:id',rejectDoctorsRequest)
router.patch('/doctor/block/:id', blockDoctorProfile)
router.patch('/doctor/unblock/:id',unblockDoctorProfile)
router.patch('/doctor/status/:id', revokeDoctorStatus)
router.get('/doctors', getAllDoctors)

router.get('/patients',getAllPatients)
router.get('/patient/:id',getPatientProfile)
router.patch('/patient/block/:id',blockPatientProfile);
router.patch('/patient/unblock/:id',unblockPatientProfile)

router.get('/search',searchController)
router.get('/search/suggestions', searchSuggestionsController)
router.get('/notifications',getAdminNotifications)
router.patch('/notifications/mark-all-read', setMarkAllRead)

export default router;