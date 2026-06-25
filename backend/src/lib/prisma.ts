import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type Character } from "../generated/prisma/client.js"
import { dbConfig } from "../config/db.js"
import { appConfig } from "../config/app.js"
import * as runtime from "@prisma/client/runtime/client"

const adapter = new PrismaPg({ connectionString: dbConfig.url })
const prisma = new PrismaClient({ adapter }).$extends({
  model: {
    refreshToken: {
      async customCreate(sub: string) {
        const expiresAt = new Date(Date.now() + appConfig.tokens.refresh.expire * 1000)
        return await prisma.refreshToken.create({
          data: { expiresAt, sub },
        })
      },
    },
  },
  result: {
    character: {
      age: {
        needs: { dob: true },
        compute(character: Character): number {
          return new Date().getUTCFullYear() - character.dob.getUTCFullYear()
        },
      },
    },
  },
})

export { prisma }
export type ExtendedPrismaClient = typeof prisma
export type ExtendedTransactionClient = Omit<ExtendedPrismaClient, runtime.ITXClientDenyList>
export type DbClient = ExtendedPrismaClient | ExtendedTransactionClient
