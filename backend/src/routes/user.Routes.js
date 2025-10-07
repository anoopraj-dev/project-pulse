import {Router} from 'express';
import { userSignup } from '../controllers/authControllers/userSignup.controller.js';
import { generateId } from '../middlewares/registrationID.js';
import { verifyOtp } from '../controllers/authControllers/verifyOtp.controller.js';
import { authCheck, userSignin } from '../controllers/authControllers/userSignin.controller.js';
import { userLogout } from '../controllers/authControllers/logout.controller.js';
import multer from 'multer'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { getCurrentUserInfo } from '../controllers/authControllers/currentUser.controller.js';

const router = Router();

const upload = multer();

//signup route
router.post('/signup',upload.none(),generateId(),userSignup);
router.post('/signin',userSignin);
router.get('/me',authenticateUser,getCurrentUserInfo)
router.post('/logout',userLogout);
router.get('/authenticate',authenticateUser,authCheck)

//email verification
router.post('/verify-email',verifyOtp)

export default router;