import type { User } from "../generated/prisma/client.js"
import type { IBaseRepository } from "./i.base.repository.js"

export interface IUserRepository {
  getById(id: number): Promise<User | null>
  getAll(): Promise<User[]>
  create(entity: User): Promise<User>
  update(entity: User): Promise<User | null>
  deleteById(id: number): Promise<void>
}
