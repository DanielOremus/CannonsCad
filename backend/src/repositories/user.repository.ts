import { type User } from "../generated/prisma/client.js"
import type { IUserRepository } from "../interfaces/i.user.repository.js"
import { prisma, type DbClient, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { UserEntity } from "../domain/user.entity.js"
import type { UserCreateInput, UserUpdateInput } from "../types/user.js"
import { BaseRepository } from "./base.repository.js"

class UserRepository extends BaseRepository<UserEntity, User> implements IUserRepository {
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma)
  }

  protected toDomain(raw: User): UserEntity {
    return raw as UserEntity
  }
  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }
  async findMany(): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany()
    return raws.map((raw) => this.toDomain(raw))
  }
  async create(data: UserCreateInput, client: DbClient = this.prisma): Promise<UserEntity> {
    const raw = await client.user.create({ data })
    return this.toDomain(raw)
  }
  async update(
    id: string,
    data: UserUpdateInput,
    client: DbClient = this.prisma,
  ): Promise<UserEntity | null> {
    const raw = await client.user.update({ where: { id }, data })
    return raw ? this.toDomain(raw) : null
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } })
    return raw ? this.toDomain(raw) : null
  }
}

export default new UserRepository(prisma)
