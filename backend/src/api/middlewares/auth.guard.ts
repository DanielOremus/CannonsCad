import type { Request, Response, NextFunction } from "express"
import type { LoggedUser } from "../../types/logged.user.js"
import JWTHelper from "../../utils/jwt.helper.js"
import { ForbiddenError, UnauthorizedError } from "../../errors/app.error.js"
import { type IUserRepository } from "../../interfaces/i.user.repository.js"
import { UserRole, UserRolePriority, UserStatus } from "@project/shared"
import userRepository from "../../repositories/user.repository.js"

const createAuthGuard =
  (userRepository: IUserRepository) =>
  (
    onlyWhenApproved: boolean = true,
    roleCheckType: "strict" | "priority" = "priority",
    role: UserRole = UserRole.REGISTERED,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    const decoded = JWTHelper.tryGetFromBearer(bearer)
    if (!decoded || !decoded.sub) return next(new UnauthorizedError())

    const dbUser = await userRepository.getById(parseInt(decoded.sub))
    if (!dbUser) return next(new UnauthorizedError())
    if (onlyWhenApproved && dbUser.status !== UserStatus.APPROVED) return next(new ForbiddenError())

    switch (roleCheckType) {
      case "priority":
        if (UserRolePriority[dbUser.role] >= UserRolePriority[role]) {
          res.locals.user = { id: dbUser.id, role: dbUser.role, status: dbUser.status }
          return next()
        }
        break
      case "strict":
        if (dbUser.role === role) {
          res.locals.user = { id: dbUser.id, role: dbUser.role, status: dbUser.status }
          return next()
        }
        break
    }
    return next(new ForbiddenError())
  }

export const authGuard = createAuthGuard(userRepository)
