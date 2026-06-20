import type { UserRegisterDTO } from "@project/shared"
import { type User } from "../generated/prisma/client.js"
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
  async create(dto: UserRegisterDTO): Promise<User> {
    return await this.prisma.user.create({ data: dto })
  }
  async update(dto: User): Promise<User | null> {
    throw new Error("Method not implemented.")
  }
  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }
}

export default new UserRepository(prisma)
