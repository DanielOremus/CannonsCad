import { Router } from "express"
import { catchAsync } from "../middlewares/errorHandler.js"
import characterController from "../controllers/characterController.js"
import { validateBody } from "../middlewares/validator.js"
import { characterCreateSchema, characterSearchSchema, UserRole } from "@project/shared"
import { authGuard } from "../middlewares/auth.guard.js"

const router = Router()

router.post(
  "/search",
  authGuard(true, "priority", UserRole.POLICE),
  validateBody(characterSearchSchema),
  catchAsync(characterController.search),
)
router.post(
  "/create",
  authGuard(true, "priority", UserRole.POLICE),
  validateBody(characterCreateSchema),
  catchAsync(characterController.create),
)

export default router
