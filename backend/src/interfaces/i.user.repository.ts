import type { UserRegisterDTO } from "@project/shared"
import type { User } from "../generated/prisma/client.js"
import type { IBaseRepository } from "./i.base.repository.js"

export interface IUserRepository extends IBaseRepository<User> {
  getAll(): Promise<User[]>
  create(entity: UserRegisterDTO): Promise<User>
  update(entity: User): Promise<User | null>
  getByEmail(email: string): Promise<User | null>
}
