import type { IBaseRepository } from "./i.base.repository.js"
import type { UserEntity } from "../domain/user.entity.js"
import type { CreateUserInput } from "../types/user.js"

export interface IUserRepository extends IBaseRepository<UserEntity> {
  getAll(): Promise<UserEntity[]>
  create(data: CreateUserInput): Promise<UserEntity>
  update(data: UserEntity): Promise<UserEntity | null>
  getByEmail(email: string): Promise<UserEntity | null>
}
