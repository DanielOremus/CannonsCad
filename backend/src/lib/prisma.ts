import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type Character } from "../generated/prisma/client.js"
import { dbConfig } from "../config/db.js"
import { v4 as uuidv4 } from "uuid"
import { appConfig } from "../config/app.js"

const adapter = new PrismaPg({ connectionString: dbConfig.url })
const prisma = new PrismaClient({ adapter }).$extends({
  model: {
    refreshToken: {
      async customCreate(sub: number) {
        const jti = uuidv4()
        const expiresAt = new Date(
          Date.now() + appConfig.tokens.refresh.expire * 1000,
        )
        return await prisma.refreshToken.create({
          data: { expiresAt, jti, sub },
        })
      },
    },
  },
  result: {
    character: {
      age: {
        needs: { dob: true },
        compute(character: Character): number {
          return new Date().getFullYear() - character.dob.getFullYear()
        },
      },
    },
  },
})

export { prisma }
export type ExtendedPrismaClient = typeof prisma
