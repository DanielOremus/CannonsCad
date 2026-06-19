import { prisma } from "../src/lib/prisma.js"
import { beforeEach, afterAll, beforeAll } from "vitest"

beforeAll(async () => {
  await prisma.user.deleteMany()
})

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.refreshToken.deleteMany()
})
afterAll(async () => {
  await prisma.$disconnect()
})
