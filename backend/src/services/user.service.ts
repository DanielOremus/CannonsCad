import type { IUserRepository } from "../interfaces/i.user.repository.js"
import userRepository from "../repositories/user.repository.js"
import { NotFoundError, ValidationError } from "../errors/app.error.js"
import UserMapper from "../mappers/user.mapper.js"
import emailSender from "../utils/email.sender.js"
import type {
  UserConfirmEmailDTO,
  UserUpdateEmailDTO,
  UserUpdateSelfDTO,
} from "@project/shared/src/validators/user.schema.js"
import { comparePassword } from "../utils/hash.js"

class UserService {
  private userRepository: IUserRepository
  private emailSender: typeof emailSender
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
    this.emailSender = emailSender
  }
  async getById(id: string, target: "public" | "me") {
    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundError("User")

    let dtoToReturn
    switch (target) {
      case "public":
        dtoToReturn = UserMapper.toPublicDto(user)
        break
      case "me":
        dtoToReturn = UserMapper.toMeDto(user)
        break
    }
    return dtoToReturn
  }
  async updateSelf(id: string, dto: UserUpdateSelfDTO) {
    const user = await this.userRepository.update(id, dto)
    if (!user) throw new NotFoundError("User")
  }
  async updateEmail(id: string, dto: UserUpdateEmailDTO) {
    const exists = await this.userRepository.findById(id)
    if (!exists) throw new NotFoundError("User")
    const isPasswordCorrect = await comparePassword(dto.password, exists.passwordHash)
    if (!isPasswordCorrect) throw new ValidationError([], "Password is incorrect")
    return await this.userRepository.transaction(async (tx) => {
      // this.emailSender.sendNotification()
      // await this.userRepository.update(id, { email: dto.email })
    })
  }
  async confirmEmail(id: string, dto: UserConfirmEmailDTO) {
    const exists = await this.userRepository.findById(id)
    if (!exists) throw new NotFoundError("User")
    //add code verification
  }
  async getAll() {
    return await this.userRepository.findMany()
  }
}

export default new UserService(userRepository)
