import express from "express"
import type { RequestHandler } from "express"
import { UserLogin, ResendOtp, RefreshToken } from "../controllers/authentication"
import { auth } from "../middleware/auth"
import { LoginOtpRateLimit } from "../middleware/rate-limiting"
import { GenerateContent } from "../controllers/agent/agentController"
const router = express.Router()


router.post('/login', LoginOtpRateLimit, UserLogin as RequestHandler)
router.post('/login/otp/resend', auth as RequestHandler, ResendOtp as RequestHandler)
router.post('/refresh', RefreshToken as RequestHandler)
router.post('/ai/response', GenerateContent as RequestHandler)

export default router
