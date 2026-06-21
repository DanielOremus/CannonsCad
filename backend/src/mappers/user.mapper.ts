import type { UserMeDTO, UserPublicDTO, UserRegisterDTO } from "@project/shared"
import type { UserEntity } from "../domain/user.entity.js"
import type { CreateUserInput } from "../types/user.js"

class UserMapper {
  static toPublicDto(user: UserEntity): UserPublicDTO {
    return {
      name: user.name,
      status: user.status,
      role: user.role,
      createdAt: JSON.parse(JSON.stringify(user.createdAt)),
    }
  }
  static toMeDto(user: UserEntity): UserMeDTO {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: JSON.parse(JSON.stringify(user.createdAt)),
    }
  }
}

export default UserMapper
