import { Router } from "express"
import { catchAsync } from "../middlewares/errorHandler.js"
import { authGuard } from "../middlewares/auth.guard.js"
import userController from "../controllers/userController.js"
import { UserRole } from "@project/shared"
const router = Router()

/* GET users listing. */
router.get("/me", authGuard(false), catchAsync(userController.me))
router.get(
  "/:id",
  authGuard(true, "strict", UserRole.ADMIN),
  catchAsync(userController.getUserById),
)

export default router
