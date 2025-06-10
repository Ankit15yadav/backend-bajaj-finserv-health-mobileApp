import { rateLimit } from 'express-rate-limit'

export const LoginOtpRateLimit = rateLimit({
    windowMs: 6 * 1000,
    limit: 1,
    message: { error: "To many OTP requests, try again in 5 seconds" },
    keyGenerator: (req) => req.body.phoneNumber,
    standardHeaders: true,
    legacyHeaders: false
})
