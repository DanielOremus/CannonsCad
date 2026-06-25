import type UserService from "../../services/user.service.js"
import type { Request, Response } from "express"
import userService from "../../services/user.service.js"
import { parseId, parseUuid } from "../../utils/parseId.js"
import type {
  UserUpdateEmailDTO,
  UserUpdateSelfDTO,
} from "@project/shared/src/validators/user.schema.js"

class UserController {
  constructor(private userService: typeof UserService) {}
  getMe = async (req: Request, res: Response) => {
    const user = await this.userService.getById(res.locals.user.id, "me")
    res.json(user)
  }
  getUserById = async (req: Request, res: Response) => {
    const id = parseUuid(req.params.id as string)
    const user = await this.userService.getById(id, "public")
    res.json(user)
  }
  updateMe = async (req: Request<{}, {}, UserUpdateSelfDTO>, res: Response) => {
    await this.userService.updateSelf(res.locals.user.id, req.body)
    res.status(204)
  }
  updateMyEmail = async (req: Request<{}, {}, UserUpdateEmailDTO>, res: Response) => {
    await this.userService.updateEmail(res.locals.user.id, req.body)
    res.status(204)
  }
  updateMyPassword = async () => {}
}

export default new UserController(userService)
