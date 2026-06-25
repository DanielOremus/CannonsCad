import { User } from "../../src/generated/prisma/client.js"
import { prisma } from "../../src/lib/prisma.js"
import { UserRole, UserStatus, type UserRegisterDTO } from "@project/shared"
import { hashPassword } from "../../src/utils/hash.js"
import { UserCreateInput } from "../../src/types/user.js"
import { generateAccess } from "./token.factory.js"
import { userCreateData } from "../constants/user.js"

async function prepareUserCreateInput(data: UserRegisterDTO): Promise<UserCreateInput> {
  const hashedPassword = await hashPassword(data.password)
  return {
    email: data.email,
    name: data.name,
    passwordHash: hashedPassword,
  }
}

export async function createUser(data: UserRegisterDTO = userCreateData): Promise<User> {
  const input = await prepareUserCreateInput(data)
  return await prisma.user.create({ data: input })
}

export async function register(role?: UserRole) {
  let user
  if (role) user = await createUserWithRole(role)
  else user = await createUser()

  const access = generateAccess({ sub: user.id })
  return { user, access }
}

export async function createUserWithRole(role: UserRole, data: UserRegisterDTO = userCreateData) {
  const input = await prepareUserCreateInput(data)
  return await prisma.user.create({ data: { ...input, status: UserStatus.APPROVED, role } })
}

export async function getByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } })
}
