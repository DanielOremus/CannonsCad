import type { UserRole } from "../enums/user.role.js"
import type { UserStatus } from "../enums/user.status.js"

export type UserMeDTO = UserPublicDTO & { email: string }

export type UserPublicDTO = {
  name: string
  status: UserStatus
  createdAt: string
  role: UserRole
}

export type UserMinDTO = {
  name: String
}
