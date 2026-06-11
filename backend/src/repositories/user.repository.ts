import { Prisma, PrismaClient, type User } from "../generated/prisma/client.js"
import type { UserDelegate } from "../generated/prisma/models.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"

class UserRepository implements IUserRepository {
  private prisma: PrismaClient | Prisma.TransactionClient
  constructor(prisma: PrismaClient | Prisma.TransactionClient) {
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
}

export default UserRepository
