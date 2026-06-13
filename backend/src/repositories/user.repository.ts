import { type User } from "../generated/prisma/client.js"
import type { UserFindUniqueArgs } from "../generated/prisma/models.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import { prisma, type ExtendedPrismaClient } from "../lib/prisma.js"

class UserRepository implements IUserRepository {
  private prisma: ExtendedPrismaClient
  constructor(prisma: ExtendedPrismaClient) {
    this.prisma = prisma
  }
  async getById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } })
  }
  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }
  async create(entity: User): Promise<User> {
    throw new Error("Method not implemented.")
  }
  async update(entity: User): Promise<User | null> {
    throw new Error("Method not implemented.")
  }
  async deleteById(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async getUnique(filter: UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(filter)
  }
}

export default new UserRepository(prisma)
