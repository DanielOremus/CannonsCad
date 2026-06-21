import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import refreshTokenRepository from "../repositories/refresh.token.repository.js"
import userRepository from "../repositories/user.repository.js"
import type { UserRegisterDTO, UserLoginDTO } from "@project/shared"
import type { AuthResponseDTO } from "../types/service.response.dto.js"
import UserMapper from "../mappers/user.mapper.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import JWTHelper from "../utils/jwt.helper.js"
import { ConflictError, UnauthorizedError } from "../errors/app.error.js"
import type { CreateUserInput } from "../types/user.js"

class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}
  async register(userData: UserRegisterDTO): Promise<AuthResponseDTO> {
    const exists = await this.userRepository.getByEmail(userData.email)
    if (exists) {
      throw new ConflictError("User with this email already exists")
    }
    const hashedPassword = await hashPassword(userData.password)
    const createInput: CreateUserInput = {
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
    }
    const user = await this.userRepository.create(createInput)
    const dbToken = await this.refreshTokenRepository.create({
      sub: user.id,
    })
    const { access, refresh } = JWTHelper.generateTokens({
      sub: user.id,
      jti: dbToken.jti,
    })

    return {
      user: UserMapper.toPublicDto(user),
      access,
      refresh,
    }
  }
  async login(userData: UserLoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.getByEmail(userData.email)
    if (!user) throw new UnauthorizedError("Invalid credentials")
    const isPasswordCorrect = await comparePassword(userData.password, user.passwordHash)
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
    const oldDbToken = await this.refreshTokenRepository.getByJti(decoded.jti)
    if (!oldDbToken) {
      if (decoded.sub) await this.refreshTokenRepository.deleteAllBySub(parseInt(decoded.sub))
      throw new UnauthorizedError()
    }
    const user = await this.userRepository.getById(oldDbToken.sub)
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
}

export default new AuthService(userRepository, refreshTokenRepository)
