import type { UserPublicDTO } from "@project/shared/src/types/user.dto.js"
import type { User } from "../generated/prisma/client.js"

class UserMapper {
  static toPublicDto(user: User): UserPublicDTO {
    return {
      name: user.name,
      status: user.status,
      createdAt: JSON.stringify(user.createdAt),
    }
  }
}

export default UserMapper
