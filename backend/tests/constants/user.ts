import { UserRegisterDTO } from "@project/shared"

// export const defaultUser =
export const userCreateData: UserRegisterDTO = {
  email: "test@gmail.com",
  name: "TestUser",
  password: "test_password",
} as const
