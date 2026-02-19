import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getPatientProfile, updatePatientProfile} from "../controllers/patientControllers/profile.controller.js";
import {  updateLifeStyleInfo, updatePersonalInfo, updateMedicalInfo } from '../controllers/patientControllers/onboarding.controller.js'
import { getApprovedDoctors,   viewDoctorProfile } from "../controllers/patientControllers/viewDoctors.controller.js";
import { searchController, searchSuggestionsController } from "../controllers/patientControllers/search.controller.js";
import upload from "../middlewares/multer.js";
import { uploadImage } from "../controllers/uploadController.js/imageUpload.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { getPatientNotifications } from "../controllers/patientControllers/notifications.controller.js";
import { getAllConversations, getAllMessages } from "../controllers/userControllers/messages.controller.js";
import { setMarkAllRead } from "../controllers/userControllers/notifications.controller.js";
import { bookAppointment, getAllAppointments, getBookingInfo, setAppointmentStatus } from "../controllers/patientControllers/appointments.controller.js";
import { createOrder, updatePaymentStatus, verifyPayment } from "../controllers/paymentControllers/payment.controller.js";
import { getPatientPaymentHistory } from "../controllers/patientControllers/paymentHistory.controller.js";

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

router.get('/notifications', getPatientNotifications)
router.patch('/notifications/mark-all-read',setMarkAllRead)

//--------- messages --------------
router.get('/messages/:id',getAllMessages)
router.get('/conversations', getAllConversations)

//-------------- appointments -------------
router.get(`/doctor/:id/booking-info`,getBookingInfo)
router.post('/appointments/book-appointment',bookAppointment);
router.get('/appointments',getAllAppointments)
router.patch('/appointments/:id', setAppointmentStatus)

//---------------- payments --------------
router.post('/create-order',createOrder);
router.post('/verify-payment',verifyPayment)
router.get('/payments',getPatientPaymentHistory)

router.patch('/payment-status',updatePaymentStatus)

export default router;
