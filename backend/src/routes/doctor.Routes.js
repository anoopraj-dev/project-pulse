import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import {
  getDoctorProfile,
  updateDoctorProfile,
  requestProfileResubmission,
  resubmitProfile
} from "../controllers/doctorControllers/profile.controller.js";
import {
  updatePersonalInfo,
  updateProfessionalInfo,
  updateServicesInfo,
} from "../controllers/doctorControllers/onboarding.controller.js";
import upload from "../middlewares/multer.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { deleteDocuments } from "../controllers/doctorControllers/documents.controller.js";
import {getDoctorNotifications} from '../controllers/doctorControllers/notifications.controller.js'
import { getAllConversations, getAllMessages } from "../controllers/userControllers/messages.controller.js";
import { setMarkAllRead } from "../controllers/userControllers/notifications.controller.js";
import { getAvailability, removeAvailabilitySlot, saveAvailability } from "../controllers/doctorControllers/availability.controller.js";
import { cancelAppointment, getAllAppointments, getDoctorAppointmentById } from "../controllers/doctorControllers/appointments.controller.js";
import { getDoctorPaymentHistory } from "../controllers/doctorControllers/paymentHistory.controller.js";
import { viewPatientProfile } from "../controllers/doctorControllers/viewPatient.controller.js";
import { searchController, searchSuggestionsController } from "../controllers/userControllers/search.controller.js";
import { getConsultationDetails, joinConsultation, endConsultation, submitPrescription, generateConsultationPDF } from "../controllers/userControllers/consultation.controller.js";
import { getPatientMedicalRecordsForDoctor } from "../controllers/patientControllers/medicalRecords.controller.js";
import { doctorDashboardStats, doctorRevenue, patientFeedbacks, recentPatients, upcomingAppointments } from "../controllers/doctorControllers/dashboard.controller.js";
import { changePassword, createSupportTicket, supportTickets } from "../controllers/userControllers/support.controller.js";
import { getDoctorExportStatus, requestDoctorExport } from "../controllers/doctorControllers/export.controller.js";
import { doctorWallet } from "../controllers/doctorControllers/wallet.controller.js";
import { requestWithdrawal } from "../controllers/doctorControllers/withdrawal.controller.js";

const router = Router();

//----------- MIDDLEWARES---------------
router.use(authenticateUser, authorizeRoles("doctor"));

//------------- ROUTES---------------
//----- Dashboard -------
router.get('/dashboard/revenue',doctorRevenue);
router.get('/dashboard/upcoming-appointments',upcomingAppointments);
router.get('/dashboard/stats',doctorDashboardStats);
router.get('/dashboard/recent-patients',recentPatients);
router.get('/dashboard/reviews',patientFeedbacks)

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

router.delete('/delete-documents/:id', deleteDocuments)
router.patch('/request-resubmission',requestProfileResubmission)
router.patch('/resubmit', resubmitProfile);

router.get('/notifications',getDoctorNotifications)
router.patch('/notifications/mark-all-read',setMarkAllRead)

router.get('/messages/:id',getAllMessages)
router.get('/conversations', getAllConversations)

router.get('/availability',getAvailability)
router.post('/availability',saveAvailability)
router.patch('/availability',removeAvailabilitySlot)

//------------ appointments-------------
router.get('/appointments',getAllAppointments)
router.get('/appointments/:id',getDoctorAppointmentById)
router.patch('/appointments/:id',cancelAppointment)
router.get('/appointments/patient-profile/:id',viewPatientProfile)

//----------------- payments ----------------
router.get('/payments',getDoctorPaymentHistory)

//---------------- Search ----------------
router.get('/search',searchController)
router.get('/search/suggestions',searchSuggestionsController)

//------------- consultation-----------
router.post('/appointments/consultation/:id',joinConsultation)
router.get('/appointments/consultation/:id',getConsultationDetails)
router.patch('/appointments/consultation/:id/end',endConsultation)
router.post('/appointments/consultation/:consultationId/prescription',submitPrescription)
router.get('/appointments/consultation/:id/pdf',generateConsultationPDF)

//------------- patient medical records -----------
router.get('/appointments/patient-records/:patientId', getPatientMedicalRecordsForDoctor)

//------------- Support and Setting ------------
router.patch('/support/change-password',changePassword);
router.post('/support/ticket',createSupportTicket);
router.get('/support/tickets',supportTickets);
router.post('/support/accountInfo',requestDoctorExport)
router.get('/support/export-status/:id',getDoctorExportStatus)

//-------------- Wallet --------------
router.get('/wallet',doctorWallet)
router.post('/wallet/withdraw',requestWithdrawal)

export default router;
