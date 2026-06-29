import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type Character } from "../generated/prisma/client.js"
import { dbConfig } from "../config/db.js"
import * as runtime from "@prisma/client/runtime/client"

const adapter = new PrismaPg({ connectionString: dbConfig.url })
const prisma = new PrismaClient({ adapter }).$extends({
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
export type ExtendedTransactionClient = Omit<
  ExtendedPrismaClient,
  runtime.ITXClientDenyList
>
export type DbClient = ExtendedPrismaClient | ExtendedTransactionClient
