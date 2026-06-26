import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import refreshTokenRepository from "../repositories/refresh.token.repository.js"
import userRepository from "../repositories/user.repository.js"
import type {
  UserRegisterDTO,
  UserLoginDTO,
  UserConfirmEmailDTO,
} from "@project/shared"
import type { AuthResponseDTO } from "../types/service.response.dto.js"
import UserMapper from "../mappers/user.mapper.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import JWTHelper from "../utils/jwt.helper.js"
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/app.error.js"
import type { UserCreateInput } from "../types/user.js"
import emailSender from "../utils/email.sender.js"
import type EmailSender from "../utils/email.sender.js"
import type { UserEntity } from "../domain/user.entity.js"
import type { RefreshTokenEntity } from "../domain/refresh.token.entity.js"
import type { IEmailConfirmationRepository } from "../interfaces/i.email.confirmation.repository.js"
import emailConfirmationRepository from "../repositories/email.confirmation.repository.js"

class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private emailConfirmationRepository: IEmailConfirmationRepository,
    private emailSender: typeof EmailSender,
  ) {}
  async register(userData: UserRegisterDTO): Promise<AuthResponseDTO> {
    const exists = await this.userRepository.findByEmail(userData.email)
    if (exists) {
      throw new ConflictError("User with this email already exists")
    }
    const hashedPassword = await hashPassword(userData.password)
    const createInput: UserCreateInput = {
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
    }
    const { user, refreshToken } = await this.userRepository.transaction<{
      user: UserEntity
      refreshToken: RefreshTokenEntity
    }>(async (tx) => {
      const user = await this.userRepository.create(createInput, tx)
      const refreshToken = await this.refreshTokenRepository.create(
        {
          sub: user.id,
        },
        tx,
      )
      const code = 1 + Math.floor(Math.random() * 899999 + 1) //create code and add to db
      await this.emailConfirmationRepository.create(
        { code, email: user.email },
        tx,
      )
      await this.emailSender.sendNotification("emailConfirm", {
        target: user.email,
        userName: user.name,
        code,
      })
      return { user, refreshToken }
    })
    const { access, refresh } = JWTHelper.generateTokens({
      sub: user.id,
      jti: refreshToken.jti,
    })

    return {
      user: UserMapper.toPublicDto(user),
      access,
      refresh,
    }
  }
  async login(userData: UserLoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(userData.email)
    if (!user) throw new UnauthorizedError("Invalid credentials")
    const isPasswordCorrect = await comparePassword(
      userData.password,
      user.passwordHash,
    )
    if (!isPasswordCorrect) throw new UnauthorizedError("Invalid credentials")
    const dbToken = await this.refreshTokenRepository.create({
      sub: user.id,
    })
    const { access, refresh } = JWTHelper.generateTokens({
      sub: user.id,
      jti: dbToken.jti,
    })

    return { user: UserMapper.toPublicDto(user), access, refresh }
  }
  async refresh(rawToken: string): Promise<AuthResponseDTO> {
    const decoded = JWTHelper.tryVerify(rawToken, "refresh")
    if (!decoded || !decoded.jti || !decoded.sub) throw new UnauthorizedError()
    const oldDbToken = await this.refreshTokenRepository.findByJti(decoded.jti)
    if (!oldDbToken) {
      if (decoded.sub)
        await this.refreshTokenRepository.deleteAllBySub(decoded.sub)
      throw new UnauthorizedError()
    }
    const user = await this.userRepository.findById(oldDbToken.sub)
    if (!user) {
      throw new UnauthorizedError()
    }
    await this.refreshTokenRepository.delete(oldDbToken.jti)
    const newDbToken = await this.refreshTokenRepository.create({
      sub: oldDbToken.sub,
    })

    const { access, refresh } = JWTHelper.generateTokens({
      jti: newDbToken.jti,
      sub: user.id,
    })

    return { access, refresh, user: UserMapper.toPublicDto(user) }
  }
  async confirmEmail(
    userData: { id: string; email: string },
    dto: UserConfirmEmailDTO,
  ) {
    const exists = await this.emailConfirmationRepository.findByEmail(
      userData.email,
    )
    if (!exists) throw new NotFoundError("User")
    if (exists.code !== dto.code) {
      throw new ConflictError("Code does not match")
    }
    await this.userRepository.transaction<void>(async (tx) => {
      await this.emailConfirmationRepository.delete(exists.id, tx)
      await this.userRepository.update(
        userData.id,
        { emailConfirmed: true },
        tx,
      )
    })
  }
}

export default new AuthService(
  userRepository,
  refreshTokenRepository,
  emailConfirmationRepository,
  emailSender,
)
