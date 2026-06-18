import type { UserRole } from "../types/user.role.js"
import type { UserStatus } from "../types/user.status.js"

export type UserMeDTO = UserPublicDTO & { email: string }

export type UserPublicDTO = {
  name: string
  status: UserStatus
  createdAt: string
  role: UserRole
}
