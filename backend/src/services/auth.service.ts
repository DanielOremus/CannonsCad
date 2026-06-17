import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import refreshTokenRepository from "../repositories/refresh.token.repository.js"
import userRepository from "../repositories/user.repository.js"
import type { UserRegisterDTO, UserLoginDTO } from "@project/shared"
import type { AuthResponseDTO, RefreshResponseDTO } from "../types/service.response.dto.js"
import UserMapper from "../mappers/user.mapper.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import JWTHelper from "../utils/jwt.helper.js"
import { ConflictError, UnauthorizedError } from "../errors/app.error.js"
import type { RefreshTokenCreateDTO } from "../types/token.js"

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
    const user = await this.userRepository.create({ ...userData, password: hashedPassword })
    const { access, refresh } = JWTHelper.generateTokens(user.id)
    const dtoToReturn = UserMapper.toPublicDto(user)

    return {
      user: dtoToReturn,
      access,
      refresh,
    }
  }
  async login(userData: UserLoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.getByEmail(userData.email)
    if (!user) throw new UnauthorizedError("Invalid credentials")
    const isPasswordCorrect = await comparePassword(userData.password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedError("Invalid credentials")
    const dtoToReturn = UserMapper.toPublicDto(user)
    const { access, refresh } = JWTHelper.generateTokens(user.id)

    return { user: dtoToReturn, access, refresh }
  }
  async refresh(rawToken: string): Promise<RefreshResponseDTO> {
    const decoded = JWTHelper.tryVerify(rawToken, "refresh")
    if (!decoded?.jti) throw new UnauthorizedError()
    const oldDbToken = await this.refreshTokenRepository.getByJti(decoded.jti)
    if (!oldDbToken) {
      if (decoded.sub) await this.refreshTokenRepository.deleteAllBySub(parseInt(decoded.sub))
      throw new UnauthorizedError()
    }
    await this.refreshTokenRepository.delete(oldDbToken.jti)
    const { token: refresh, jti, expiresAt } = JWTHelper.generateRefreshToken(oldDbToken.sub)
    const tokenCreateDto: RefreshTokenCreateDTO = {
      jti,
      sub: oldDbToken.sub,
      expiresAt,
    }
    await this.refreshTokenRepository.create(tokenCreateDto)
    const access = JWTHelper.generateAccessToken(oldDbToken.sub)
    return { access, refresh }
  }
}

export default new AuthService(userRepository, refreshTokenRepository)
