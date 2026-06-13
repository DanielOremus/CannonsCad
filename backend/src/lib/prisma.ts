import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type Character } from "../generated/prisma/client.js"
import { dbConfig } from "../config/db.js"

const adapter = new PrismaPg({ connectionString: dbConfig.url })
const prisma = new PrismaClient({ adapter }).$extends({
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
