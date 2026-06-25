import { Router } from "express"
import { catchAsync } from "../middlewares/errorHandler.js"
import { authGuard } from "../middlewares/auth.guard.js"
import userController from "../controllers/userController.js"
import { UserRole } from "@project/shared"
const router = Router()

/* GET users listing. */
router.get("/me", authGuard(false), catchAsync(userController.getMe))
router.get(
  "/:id",
  authGuard(true, "strict", UserRole.ADMIN),
  catchAsync(userController.getUserById),
)
router.patch("/me", authGuard(true, "priority", "CIVILIAN"), catchAsync(userController.updateMe))

export default router
