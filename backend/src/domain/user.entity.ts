import type { UserRole, UserStatus } from "@project/shared"
import type { BaseEntityUuid } from "./base.entity.js"

export type UserEntity = Readonly<
  BaseEntityUuid & {
    name: string
    email: string
    role: UserRole
    status: UserStatus
    emailConfirmed: boolean
    passwordHash: string
    createdAt: Date
  }
>
