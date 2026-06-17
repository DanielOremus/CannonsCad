export type UserMeDTO = UserPublicDTO & { email: string }

export type UserPublicDTO = {
  name: string
  status: string
  createdAt: string
}
