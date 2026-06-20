import { type ICharacterRepository } from "../interfaces/i.character.repository.js"
import { type Character } from "../generated/prisma/client.js"
import { prisma, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { CharacterCreateInput } from "../types/character.js"
import type { CharacterSearchDTO } from "@project/shared/src/validators/character.schema.js"
import { Prisma } from "../generated/prisma/client.js"

class CharacterRepository implements ICharacterRepository {
  private prisma: ExtendedPrismaClient
  constructor(prisma: ExtendedPrismaClient) {
    this.prisma = prisma
  }
  async getByNameAndDob(dto: CharacterSearchDTO): Promise<RawCharacter | null> {
    return await this.prisma.character.findFirst({
      where: {
        AND: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          dob: dto.dob,
        },
      },
      include: CHARACTER_INCLUDE,
    })
  }
  async create(data: CharacterCreateInput): Promise<Character> {
    return await this.prisma.character.create({ data })
  }
  getById(id: number): Promise<Character> {
    throw new Error("Method not implemented.")
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default new CharacterRepository(prisma)
