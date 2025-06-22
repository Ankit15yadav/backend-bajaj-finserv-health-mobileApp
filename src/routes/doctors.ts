import express, { type RequestHandler } from "express"
import { getDoctorInformation } from "../controllers/doctors.controller"
import { auth } from "../middleware/auth"
const router = express.Router()

router.get("/doctor", auth as RequestHandler, getDoctorInformation as RequestHandler)

export default router
