import { Router } from "express";
import { authenticateUser} from "../middlewares/authenticateUser.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { getAdminDashboard, getDoctorDocuments, getPendingDoctorProfile,getAdminNotifications, dashboardCounts, revenueDashboardOverview, dashboardUserGrowth, dashboardSupportData } from "../controllers/adminControllers/adminDashboard.controller.js";
import { approveDoctorsRequest,rejectDoctorsRequest,blockDoctorProfile,unblockDoctorProfile,revokeDoctorStatus,getAllDoctors } from "../controllers/adminControllers/adminViewDoctors.controller.js";
import { blockPatientProfile, getAllPatients, getPatientProfile, unblockPatientProfile } from "../controllers/adminControllers/adminViewPatients.controller.js";
import { searchSuggestionsController,searchController } from "../controllers/userControllers/search.controller.js";
import { setMarkAllRead } from "../controllers/userControllers/notifications.controller.js";
import { getAllAppointments, setAdminAppointmentStatus } from "../controllers/adminControllers/adminAppoiintments.controller.js";
import { changePassword, supportTickets, systemAlerts, updateAlertStatus, updateTicketStatus } from "../controllers/userControllers/support.controller.js";
import { revenueSummary } from "../controllers/adminControllers/adminRevenue.controller.js";
import { getRevenueExportStatus, requestRevenueExport } from "../controllers/adminControllers/export.controller.js";
const router = Router();

//-------------MIDDLEWARES -----------
router.use(authenticateUser,authorizeRoles('admin'))



//--------------ROUTES-------------
router.get('/dashboard',getAdminDashboard)

router.get('/dashboard/stats',dashboardCounts)
router.get('/dashboard/revenue',revenueDashboardOverview)
router.get('/dashboard/user-growth',dashboardUserGrowth)

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

router.get('/appointments',getAllAppointments)
router.patch('/appointments/:id',setAdminAppointmentStatus)

router.get('/support/tickets',supportTickets)
router.get('/support/alerts',systemAlerts);
router.patch('/support/update-ticket/:id', updateTicketStatus)
router.patch('/support/update-alert/:id', updateAlertStatus)
router.patch('/support/change-password',changePassword);

router.get('/revenue/summary',revenueSummary);

router.post('/revenue/report',requestRevenueExport)
router.get('/revenue/export-status/:id',getRevenueExportStatus)

router.get('/dashboard/alerts',dashboardSupportData)

export default router;