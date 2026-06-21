import { CharacterCreateDTO } from "@project/shared"
import { prisma } from "../../src/lib/prisma"
import { CharacterCreateInput } from "../../src/types/character"
import { characterCreateData } from "../constants/character"

export async function createCharacter(data: CharacterCreateInput) {
  return await prisma.character.create({ data })
}
export async function createCharacterWithRelations(data: CharacterCreateInput) {
  return await prisma.character.create({
    data,
    include: { driverLicense: true, user: true, vehicles: true },
  })
}
export function getCharacterCreateInput(
  userId: number,
  dto: CharacterCreateDTO,
): CharacterCreateInput {
  return { ...dto, userId }
}
