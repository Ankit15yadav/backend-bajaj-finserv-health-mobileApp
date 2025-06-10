import express from "express"
import type { RequestHandler } from "express"
import { AddUserDetails } from "../controllers/user.details"
import { auth } from "../middleware/auth"
const router = express.Router()

router.patch('/users/profile', auth as RequestHandler, AddUserDetails as RequestHandler)

export default router
