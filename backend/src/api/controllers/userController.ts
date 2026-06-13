import type { UserRegisterDTO } from "@project/shared"
import type UserService from "../../services/user.service.js"
import type { Request, Response } from "express"
import userService from "../../services/user.service.js"

class UserController {
  constructor(private userService: typeof UserService) {}
  async register(req: Request, res: Response) {
    const userData = req.body as UserRegisterDTO

    const newUser = this.userService.register(userData)

    res.status(201).json(newUser)
  }
}

export default new UserController(userService)
