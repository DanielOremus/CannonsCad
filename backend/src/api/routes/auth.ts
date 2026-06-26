import { Router } from "express"
import { catchAsync } from "../middlewares/errorHandler.js"
import { validateBody } from "../middlewares/validator.js"
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
} from "@project/shared"
import authController from "../controllers/authController.js"
const router = Router()

router.post(
  "/register",
  validateBody(registerSchema),
  catchAsync(authController.register),
)
router.post(
  "/login",
  validateBody(loginSchema),
  catchAsync(authController.login),
)
router.post(
  "/confirm-email",
  validateBody(confirmEmailSchema),
  catchAsync(authController.confirmEmail),
)
router.post("/refresh", catchAsync(authController.refresh))

export default router
