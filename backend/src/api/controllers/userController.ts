import type UserService from "../../services/user.service.js"
import type { Request, Response } from "express"
import userService from "../../services/user.service.js"

class UserController {
  constructor(private userService: typeof UserService) {}
  me = async (req: Request, res: Response) => {
    const user = await this.userService.getById(res.locals.user.id, "me")
    res.json(user)
  }
  getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getById(parseInt(req.params.id as string), "public")
    res.json(user)
  }
}

export default new UserController(userService)
