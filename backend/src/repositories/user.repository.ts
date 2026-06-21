import { type User } from "../generated/prisma/client.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import { prisma, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { UserEntity } from "../domain/user.entity.js"
import type { CreateUserInput } from "../types/user.js"
import { BaseRepository } from "./base.repository.js"

class UserRepository extends BaseRepository<UserEntity, User> implements IUserRepository {
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma)
  }
  protected toDomain(raw: User): UserEntity {
    return raw as UserEntity
  }
  async getById(id: number): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }
  async getAll(): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany()
    return raws.map((raw) => this.toDomain(raw))
  }
  async create(data: CreateUserInput): Promise<UserEntity> {
    const raw = await this.prisma.user.create({ data })
    return this.toDomain(raw)
  }
  async update(dto: User): Promise<User | null> {
    throw new Error("Method not implemented.")
  }
  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } })
    return raw ? this.toDomain(raw) : null
  }
}

export default new UserRepository(prisma)
