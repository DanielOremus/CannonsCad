import { User } from "../../src/generated/prisma/client.js"
import { prisma } from "../../src/lib/prisma.js"
import { UserRole, type UserRegisterDTO, type UserStatus } from "@project/shared"
import { hashPassword } from "../../src/utils/hash.js"
import { v4 as uuidv4 } from "uuid"

export async function createUser(
  status: UserStatus = "APPROVED",
  role: UserRole = UserRole.REGISTERED,
  dto: UserRegisterDTO = {
    email: `test-${uuidv4()}@gmail.com`,
    name: "test",
    password: "test",
  },
): Promise<User> {
  const hashedPassword = await hashPassword(dto.password)
  return await prisma.user.create({ data: { ...dto, password: hashedPassword, status, role } })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } })
}
