import { Router } from "express"
import { catchAsync } from "../middlewares/errorHandler.js"
import { validate } from "../middlewares/validator.js"
import { loginSchema, registerSchema } from "@project/shared"
import authController from "../controllers/authController.js"
const router = Router()

router.post("/register", validate(registerSchema), catchAsync(authController.register))
router.post("/login", validate(loginSchema), catchAsync(authController.login))
router.post("/refresh", catchAsync(authController.refresh))

export default router
