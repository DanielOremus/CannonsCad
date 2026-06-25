import { type CharacterCardDTO, type CharacterCreateDTO } from "@project/shared"
import { Gender, type CharacterFlag } from "../generated/prisma/client.js"
import type { CharacterCreateInput } from "../types/character.js"
import type { CharacterEntity } from "../domain/character.entity.js"
import type { CharacterListItemDTO } from "@project/shared/src/dtos/character.dto.js"

class CharacterMapper {
  static toCreateInput(userId: string, dto: CharacterCreateDTO): CharacterCreateInput {
    return {
      ...dto,
      gender: dto.gender as Gender,
      userId,
      flags: dto.flags as CharacterFlag[],
    }
  }
  static toCardDTO(character: CharacterEntity): CharacterCardDTO {
    return {
      id: character.id,
      firstName: character.firstName,
      lastName: character.lastName,
      gender: character.gender,
      dob: character.dob.toISOString().slice(0, 10),
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
  static toListItemDTO(character: CharacterEntity): CharacterListItemDTO {
    return {
      id: character.id,
      firstName: character.firstName,
      lastName: character.lastName,
      age: character.age,
      dob: character.dob.toISOString().slice(0, 10),
      gender: character.gender,
      idNumber: character.idNumber,
      flags: character.flags,
      user: character.user ? { name: character.user.name } : null,
    }
  }
}

export default CharacterMapper
