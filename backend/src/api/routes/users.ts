import { Router, type Request, type Response } from "express"
import userService from "../../services/user.service.js"
import { catchAsync } from "../middlewares/errorHandler.js"
const router = Router()

/* GET users listing. */
router.get(
  "/",
  catchAsync(async function (req: Request, res: Response) {
    const users = await userService.getAll()
    res.json(users)
  }),
)

export default router
