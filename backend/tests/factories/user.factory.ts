import { User } from "../../src/generated/prisma/client.js"
import { prisma } from "../../src/lib/prisma.js"
import { UserRole, type UserRegisterDTO, type UserStatus } from "@project/shared"
import { hashPassword } from "../../src/utils/hash.js"

export async function createUser(
  status: UserStatus = "APPROVED",
  role: UserRole = UserRole.REGISTERED,
): Promise<User> {
  const hashedPassword = await hashPassword("test")
  const dto: UserRegisterDTO = { email: "test@gmail.com", name: "test", password: hashedPassword }
  return await prisma.user.create({ data: { ...dto, status, role } })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } })
}
