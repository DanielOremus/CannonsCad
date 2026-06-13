import type { UserLoginDTO, UserRegisterDTO } from "@project/shared"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import userRepository from "../repositories/user.repository.js"
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/app.error.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import JWTHelper from "../utils/jwt.helper.js"
import UserMapper from "../mappers/user.mapper.js"

class UserService {
  private userRepository: IUserRepository
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }
  async getById(id: number) {
    const user = await this.userRepository.getById(id)
    if (!user) throw new NotFoundError("User")
    return user
  }
  async getAll() {
    return await this.userRepository.getAll()
  }
  async register(userData: UserRegisterDTO) {
    const exists = await this.userRepository.getUnique({
      where: { email: userData.email },
    })
    if (!!exists) {
      throw new ConflictError("User with this email already exists")
    }
    userData.password = await hashPassword(userData.password)
    const user = await this.userRepository.create(userData)
    const access = JWTHelper.generateToken(user.id, "access")
    const refresh = JWTHelper.generateToken(user.id, "refresh")
    const dtoToReturn = UserMapper.toPublicDto(user)
    return { user: dtoToReturn, access, refresh }
  }
  async login(userData: UserLoginDTO) {
    const user = await this.userRepository.getUnique({
      where: { email: userData.email },
    })
    if (!user) throw new UnauthorizedError()
    const isPasswordCorrect = await comparePassword(
      userData.password,
      user.password,
    )
    if (!isPasswordCorrect) throw new UnauthorizedError()
    const access = JWTHelper.generateToken(user.id, "access")
    const refresh = JWTHelper.generateToken(user.id, "refresh")
    const dtoToReturn = UserMapper.toPublicDto(user)
    return { user: dtoToReturn, access, refresh }
  }
}

export default new UserService(userRepository)
