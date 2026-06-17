import type { UserRole, UserStatus } from "@project/shared"

export type LoggedUser = {
  id: number
  status: UserStatus
  role: UserRole
}
