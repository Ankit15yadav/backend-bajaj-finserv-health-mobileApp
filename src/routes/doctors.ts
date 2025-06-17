import express, { type RequestHandler } from "express"
import { getDoctorInformation } from "../controllers/doctors.controller"
const router = express.Router()

router.get("/doctor", getDoctorInformation as RequestHandler)

export default router
