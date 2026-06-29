import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import refreshTokenRepository from "../repositories/refresh.token.repository.js"
import userRepository from "../repositories/user.repository.js"
import {
  type UserRegisterDTO,
  type UserLoginDTO,
  type UserConfirmEmailDTO,
  ErrorCode,
} from "@project/shared"
import type { AuthResponseDTO } from "../types/service.response.dto.js"
import UserMapper from "../mappers/user.mapper.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import JWTHelper from "../utils/jwt.helper.js"
import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../errors/app.error.js"
import type { UserCreateInput } from "../types/user.js"
import emailSender from "../utils/email.sender.js"
import EmailSender from "../utils/email.sender.js"
import type { UserEntity } from "../domain/user.entity.js"
import type { RefreshTokenEntity } from "../domain/refresh.token.entity.js"
import type { IEmailConfirmationRepository } from "../interfaces/i.email.confirmation.repository.js"
import emailConfirmationRepository from "../repositories/email.confirmation.repository.js"
import { appConfig } from "../config/app.js"
import prettifyTime from "../utils/prettify.time.js"
import { randomInt } from "node:crypto"

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
      throw new AppError("User with this email already exists", 409, ErrorCode.ALREADY_EXISTS)
    }
    const hashedPassword = await hashPassword(userData.password)
    const createInput: UserCreateInput = {
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
    }
    const { user, refreshToken, emailConfirmCode } = await this.userRepository.transaction<{
      user: UserEntity
      refreshToken: RefreshTokenEntity
      emailConfirmCode: string
    }>(async (tx) => {
      const user = await this.userRepository.create(createInput, tx)
      console.log(user)
      const refreshToken = await this.refreshTokenRepository.create(
        {
          sub: user.id,
          expiresAt: new Date(Date.now() + appConfig.tokens.refresh.expire * 1000),
        },
        tx,
      )
      const code = randomInt(100000, 999999).toString()
      await this.emailConfirmationRepository.create(
        {
          code,
          email: user.email,
          expiresAt: new Date(Date.now() + appConfig.email.confirmExpire),
        },
        tx,
      )
      return { emailConfirmCode: code, user, refreshToken }
    })
    await this.emailSender.sendNotification("emailConfirm", {
      target: user.email,
      userName: user.name,
      expiresIn: prettifyTime(appConfig.email.confirmExpire),
      code: emailConfirmCode,
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
    const isPasswordCorrect = await comparePassword(userData.password, user.passwordHash)
    if (!isPasswordCorrect) throw new UnauthorizedError("Invalid credentials")
    const dbToken = await this.refreshTokenRepository.create({
      sub: user.id,
      expiresAt: new Date(Date.now() + appConfig.tokens.refresh.expire * 1000),
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
      if (decoded.sub) await this.refreshTokenRepository.deleteAllBySub(decoded.sub)
      throw new UnauthorizedError()
    }
    const user = await this.userRepository.findById(oldDbToken.sub)
    if (!user) {
      throw new UnauthorizedError()
    }
    await this.refreshTokenRepository.delete(oldDbToken.jti)
    const newDbToken = await this.refreshTokenRepository.create({
      sub: oldDbToken.sub,
      expiresAt: new Date(Date.now() + appConfig.tokens.refresh.expire * 1000),
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
  ): Promise<void> {
    const exists = await this.emailConfirmationRepository.findByEmail(userData.email)
    if (!exists) throw new NotFoundError("Confirmation")

    if (exists.expiresAt.getTime() <= new Date().getTime()) {
      await this.emailConfirmationRepository.deleteByEmail(exists.email)
      throw new AppError("Code expired", 410, ErrorCode.CODE_EXPIRED)
    }
    if (exists.code !== dto.code) {
      if (exists.attempts >= 2) {
        await this.emailConfirmationRepository.deleteByEmail(exists.email)
        throw new AppError("Out of attempts", 403, ErrorCode.TOO_MANY_ATTEMPTS)
      }
      await this.emailConfirmationRepository.incrementAttempt(exists.email)
      throw new ValidationError([], "Code does not match")
    }
    await this.userRepository.transaction<void>(async (tx) => {
      await this.emailConfirmationRepository.deleteByEmail(exists.email, tx)
      await this.userRepository.update(userData.id, { emailConfirmed: true }, tx)
    })
    console.log(111)
  }
}

export default new AuthService(
  userRepository,
  refreshTokenRepository,
  emailConfirmationRepository,
  emailSender,
)
