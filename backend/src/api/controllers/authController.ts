import authService from "../../services/auth.service.js"
import type { NextFunction, Request, Response } from "express"
import type AuthService from "../../services/auth.service.js"
import { appConfig } from "../../config/app.js"
import type {
  UserRegisterDTO,
  UserLoginDTO,
  UserConfirmEmailDTO,
} from "@project/shared"

class AuthController {
  constructor(private authService: typeof AuthService) {}

  private setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refresh", token, {
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict",
      maxAge: appConfig.tokens.refresh.expire * 1000,
    })
  }
  register = async (req: Request<{}, {}, UserRegisterDTO>, res: Response) => {
    const { user, access, refresh } = await this.authService.register(req.body)

    this.setRefreshTokenCookie(res, refresh)
    res.status(201).json({ user, access })
  }
  login = async (req: Request<{}, {}, UserLoginDTO>, res: Response) => {
    const { user, access, refresh } = await this.authService.login(req.body)

    this.setRefreshTokenCookie(res, refresh)
    res.status(200).json({ user, access })
  }
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh
      const { access, refresh } = await this.authService.refresh(refreshToken)
      this.setRefreshTokenCookie(res, refresh)

      return res.status(200).json(access)
    } catch (error) {
      res.clearCookie("refresh")
      next(error)
    }
  }
  confirmEmail = async (
    req: Request<{}, {}, UserConfirmEmailDTO>,
    res: Response,
  ) => {
    await this.authService.confirmEmail(
      {
        id: res.locals.user.id,
        email: res.locals.user.email,
      },
      req.body,
    )
  }
}

export default new AuthController(authService)
