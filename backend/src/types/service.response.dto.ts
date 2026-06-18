import type { UserPublicDTO } from "@project/shared"

export type AuthResponseDTO = {
  user: UserPublicDTO
  access: string
  refresh: string
}
