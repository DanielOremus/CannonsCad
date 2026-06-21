import type UserService from "../../services/user.service.js"
import type { Request, Response } from "express"
import userService from "../../services/user.service.js"
import { parseId } from "../../utils/parseId.js"

class UserController {
  constructor(private userService: typeof UserService) {}
  me = async (req: Request, res: Response) => {
    const user = await this.userService.getById(res.locals.user.id, "me")
    res.json(user)
  }
  getUserById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id as string)
    const user = await this.userService.getById(id, "public")
    res.json(user)
  }
}

export default new UserController(userService)
