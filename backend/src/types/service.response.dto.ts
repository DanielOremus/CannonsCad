import type { UserPublicDTO } from "@project/shared"

export type AuthResponseDTO = {
  user: UserPublicDTO
  access: string
  refresh: string
}
export type RefreshResponseDTO = Omit<AuthResponseDTO, "user">
