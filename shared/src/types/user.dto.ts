export type UserLoginDTO = {
  email: string
  password: string
}

export type UserRegisterDTO = UserLoginDTO & { name: string }

export type UserMeDTO = UserPublicDTO & { email: string }

export type UserPublicDTO = {
  name: string
  status: string
  createdAt: string
}
