import type { UserEntity } from "../domain/user.entity.js"

export type UserCreateInput = Pick<UserEntity, "name" | "email" | "passwordHash">
export type UserUpdateInput = Partial<
  Pick<UserEntity, "name" | "email" | "role" | "status" | "passwordHash">
>
