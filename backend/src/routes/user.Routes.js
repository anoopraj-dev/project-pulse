import {Router} from 'express';
import { userSignup } from '../controllers/authControllers/userSignup.controller.js';
import { generateId } from '../middlewares/registrationID.js';
import { resendOtp, resetPassword, setNewPassword, verifyOtp } from '../controllers/authControllers/verifyOtp.controller.js';
import { authCheck, userSignin } from '../controllers/authControllers/userSignin.controller.js';
import { userLogout } from '../controllers/authControllers/logout.controller.js';
import multer from 'multer'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { getCurrentUserInfo } from '../controllers/authControllers/currentUser.controller.js';
import { verifyClerkSignature } from '../middlewares/clerkMiddleware.js';
import { clerkUserSignup } from '../controllers/authControllers/userSignup.controller.js';
import { updateClerKUserRole } from '../controllers/authControllers/userSignup.controller.js';
import { rawBodyMiddleware } from '../middlewares/clerkMiddleware.js';
const router = Router();

const upload = multer();

//signup route
router.post('/signup',upload.none(),generateId(),userSignup);
router.post('/signin',userSignin);
router.get('/me',authenticateUser,getCurrentUserInfo)
router.post('/logout',authenticateUser,userLogout);
router.get('/authenticate',authenticateUser,authCheck)
router.post('/reset-password', resetPassword);
router.post('/verify-email',verifyOtp)
router.post('/set-password',setNewPassword);
router.post('/resend-otp',resendOtp);
router.post('/clerk-webhook',rawBodyMiddleware,verifyClerkSignature, clerkUserSignup)
router.post('/update-user-role', updateClerKUserRole )



export default router;