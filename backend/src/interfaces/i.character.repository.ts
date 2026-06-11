import type { PrismaClient } from "../generated/prisma/client.js"

export interface ICharacterRepository {
  dbClient: PrismaClient
}
