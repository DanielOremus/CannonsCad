import type { UserMeDTO, UserPublicDTO } from "@project/shared"
import type { User } from "../generated/prisma/client.js"

class UserMapper {
  static toPublicDto(user: User): UserPublicDTO {
    return {
      name: user.name,
      status: user.status,
      createdAt: JSON.parse(JSON.stringify(user.createdAt)),
    }
  }
  static toMeDto(user: User): UserMeDTO {
    return {
      email: user.email,
      name: user.name,
      status: user.status,
      createdAt: JSON.parse(JSON.stringify(user.createdAt)),
    }
  }
}

export default UserMapper
