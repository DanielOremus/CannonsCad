import type { Request, Response, NextFunction } from "express"
import JWTHelper from "../../utils/jwt.helper.js"
import { ForbiddenError, UnauthorizedError } from "../../errors/app.error.js"
import { type IUserRepository } from "../../interfaces/i.user.repository.js"
import { UserRole, UserRolePriority, UserStatus } from "@project/shared"
import userRepository from "../../repositories/user.repository.js"
import type { UserEntity } from "../../domain/user.entity.js"

const createAuthGuard =
  (userRepository: IUserRepository) =>
  (
    roleCheckType: "strict" | "priority" = "priority",
    role: UserRole = UserRole.REGISTERED,
    account: { mustBeApproved: boolean; emailMustBeConfirmed: boolean } = {
      mustBeApproved: true,
      emailMustBeConfirmed: true,
    },
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    const decoded = JWTHelper.tryGetFromBearer(bearer)
    if (!decoded || !decoded.sub) return next(new UnauthorizedError())

    const dbUser = await userRepository.findById(decoded.sub)
    if (!dbUser) return next(new UnauthorizedError())
    if (!isAccountSatisfactory(account, dbUser)) return next(new ForbiddenError())

    switch (roleCheckType) {
      case "priority":
        if (UserRolePriority[dbUser.role] >= UserRolePriority[role]) {
          res.locals.user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          }
          return next()
        }
        break
      case "strict":
        if (dbUser.role === role) {
          res.locals.user = {
            name: dbUser.name,
            id: dbUser.id,
            role: dbUser.role,
            status: dbUser.status,
          }
          return next()
        }
        break
    }
    return next(new ForbiddenError())
  }

function isAccountSatisfactory(
  reqAccount: { mustBeApproved: boolean; emailMustBeConfirmed: boolean },
  user: UserEntity,
) {
  if (
    (reqAccount.mustBeApproved && !isAccountApproved(user)) ||
    (reqAccount.emailMustBeConfirmed && !user.emailConfirmed)
  )
    return false
  return true
}
function isAccountApproved(user: UserEntity) {
  return user.status === UserStatus.APPROVED
}

export const authGuard = createAuthGuard(userRepository)
