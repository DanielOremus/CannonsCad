import type { PrismaClient } from "../generated/prisma/client.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import { prisma } from "../lib/prisma.js"
import UserRepository from "../repositories/user.repository.js"

class UserService {
  private userRepository: IUserRepository
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }
  async getById(id: number) {
    const user = await this.userRepository.getById(id)
    if (!user) return null
    return user
  }
  async getAll() {
    return await this.userRepository.getAll()
  }
}

export default new UserService(prisma)
