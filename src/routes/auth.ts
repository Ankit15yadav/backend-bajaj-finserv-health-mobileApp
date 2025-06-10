import express from "express"
import type { RequestHandler } from "express"
import { UserLogin, ResendOtp, RefreshToken } from "../controllers/authentication"
import { auth } from "../middleware/auth"
import { LoginOtpRateLimit } from "../middleware/rate-limiting"
const router = express.Router()


router.post('/login', LoginOtpRateLimit, UserLogin as RequestHandler)
router.post('/login/otp/resend', auth as RequestHandler, ResendOtp as RequestHandler)
router.post('/refresh', RefreshToken as RequestHandler)

export default router
