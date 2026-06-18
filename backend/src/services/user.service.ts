import type { IUserRepository } from "../interfaces/i.user.repository.js"
import userRepository from "../repositories/user.repository.js"
import { NotFoundError } from "../errors/app.error.js"
import UserMapper from "../mappers/user.mapper.js"

class UserService {
  private userRepository: IUserRepository
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }
  async getById(id: number, target: "public" | "me") {
    const user = await this.userRepository.getById(id)
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
  async getAll() {
    return await this.userRepository.getAll()
  }
}

export default new UserService(userRepository)
