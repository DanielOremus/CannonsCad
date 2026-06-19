import { prisma } from "../src/lib/prisma.js"
import { beforeEach, afterAll } from "vitest"

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.refreshToken.deleteMany()
})
afterAll(async () => {
  await prisma.$disconnect()
})
