import authService from "../../services/auth.service.js"
import type { Request, Response } from "express"
import type AuthService from "../../services/auth.service.js"
import { appConfig } from "../../config/app.js"
import type { UserRegisterDTO, UserLoginDTO } from "@project/shared"
import ms, { type StringValue } from "ms"

class AuthController {
  constructor(private authService: typeof AuthService) {}

  private setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refresh", token, {
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict",
      maxAge: ms(appConfig.tokens.refresh.expire as StringValue),
    })
  }
  register = async (req: Request, res: Response) => {
    const userData = req.body as UserRegisterDTO

    const { user, access, refresh } = await this.authService.register(userData)

    this.setRefreshTokenCookie(res, refresh)
    res.status(201).json({ user, access })
  }
  login = async (req: Request, res: Response) => {
    const userData = req.body as UserLoginDTO

    const { user, access, refresh } = await this.authService.login(userData)

    this.setRefreshTokenCookie(res, refresh)
    res.status(200).json({ user, access })
  }
  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh
    const { access, refresh } = await this.authService.refresh(refreshToken)
    this.setRefreshTokenCookie(res, refresh)

    return res.status(200).json(access)
  }
}

export default new AuthController(authService)
