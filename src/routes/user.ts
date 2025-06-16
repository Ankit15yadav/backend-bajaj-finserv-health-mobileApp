import express from "express"
import type { RequestHandler } from "express"
import { AddUserDetails, getUserDetails } from "../controllers/user.details"
import { auth } from "../middleware/auth"
const router = express.Router()

router.patch('/users/profile', auth as RequestHandler, AddUserDetails as RequestHandler)
router.get('/user', auth as RequestHandler, getUserDetails as RequestHandler)

export default router
