import express from "express"
import { UserLogin, ResendOtp } from "../controllers/authentication"
const router = express.Router()


router.post('/login', UserLogin)
router.post('/login/otp/resend', ResendOtp)

export default router