import type { UserRegisterDTO } from "@project/shared"
import type { User } from "../generated/prisma/client.js"
import type {
  UserFindFirstArgs,
  UserFindUniqueArgs,
  UserWhereInput,
} from "../generated/prisma/models.js"

export interface IUserRepository {
  getById(id: number): Promise<User | null>
  getAll(): Promise<User[]>
  create(entity: UserRegisterDTO): Promise<User>
  update(entity: User): Promise<User | null>
  deleteById(id: number): Promise<void>
  getUnique(filter: UserFindUniqueArgs): Promise<User | null>
}
