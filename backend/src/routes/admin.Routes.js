import { Router } from "express";
import { adminLogin } from "../controllers/authControllers/adminLogin.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = Router();

router.post('/login',adminLogin)

export default router;