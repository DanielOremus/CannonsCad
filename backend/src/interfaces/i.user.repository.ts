import type { UserEntity } from "../domain/user.entity.js"
import type { DbClient } from "../lib/prisma.js"
import type { UserCreateInput, UserUpdateInput } from "../types/user.js"
import type { IBaseRepository } from "./i.base.repository.js"

export interface IUserRepository extends IBaseRepository {
  findById(id: string): Promise<UserEntity | null>
  delete(id: string): Promise<void>
  findMany(): Promise<UserEntity[]>
  create(data: UserCreateInput, client?: DbClient): Promise<UserEntity>
  update(id: string, data: UserUpdateInput, client?: DbClient): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
}
