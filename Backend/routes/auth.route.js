import express from 'express';
import { loginController, logoutController, refreshToken, signupController , getprofile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/signup", signupController)
router.post("/login", loginController)
router.post("/logout", logoutController)
router.post("/refresh-token", refreshToken)
router.get("/profie",protectRoute, getprofile)

export default router;