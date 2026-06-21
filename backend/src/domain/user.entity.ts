import type { UserRole, UserStatus } from "@project/shared"
import type { BaseEntity } from "./base.entity.js"

export type UserEntity = BaseEntity & {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  passwordHash: string
  createdAt: Date
}
