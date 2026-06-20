import {
  type CharacterCardDTO,
  type CharacterCreateDTO,
  type OwnersVehicle,
} from "@project/shared"
import {
  Gender,
  type CharacterFlag,
  type Character,
} from "../generated/prisma/client.js"
import type { CharacterCreateInput } from "../types/character.js"
import { Prisma } from "../generated/prisma/client.js"
import { prisma } from "../lib/prisma.js"

type CharacterWithRelations = Prisma.Result<
  typeof prisma.character,
  { include: { driverLicense: true; user: true; vehicles: true } },
  "findFirstOrThrow"
>

class CharacterMapper {
  static toCreateInput(
    userId: number,
    dto: CharacterCreateDTO,
  ): CharacterCreateInput {
    return {
      ...dto,
      gender: dto.gender as Gender,
      userId,
      flags: dto.flags as CharacterFlag[],
    }
  }
  static toCardDTO(character: CharacterWithRelations): CharacterCardDTO {
    return {
      id: character.id,
      firstName: character.firstName,
      lastName: character.lastName,
      gender: character.gender,
      dob: JSON.parse(JSON.stringify(character.dob)),
      age: character.age,
      idNumber: character.idNumber,
      phoneNumber: character.phoneNumber,
      address: character.address,
      driverLicense: character.driverLicense
        ? {
            id: character.driverLicense.id,
            categories: character.driverLicense.categories,
          }
        : null,
      hasGunPermit: character.hasGunPermit,
      user: character.user ? { name: character.user.name } : null,
      vehicles: character.vehicles,
      flags: character.flags,
    }
  }
}

export default CharacterMapper
