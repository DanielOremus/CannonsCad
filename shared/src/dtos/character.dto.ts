import type { CharacterFlag, Gender } from "../enums/character.js"
import type { BaseDTO } from "./base.dto.js"
import type { CharactersDriverLicenseDTO } from "./driver.license.dto.js"
import type { PaginatedResponse } from "./pagination.dto.js"
import type { UserMinDTO } from "./user.dto.js"
import type { OwnersVehicleDTO } from "./vehicle.dto.js"

export type CharacterCardDTO = BaseDTO & {
  firstName: string
  lastName: string
  dob: string
  age: number
  gender: Gender
  idNumber: string
  driverLicense: CharactersDriverLicenseDTO | null
  phoneNumber: string | null
  address: string | null
  hasGunPermit: boolean
  flags: CharacterFlag[]
  user: UserMinDTO | null
  vehicles: OwnersVehicleDTO[]
}

export type CharacterListItemDTO = BaseDTO & {
  firstName: string
  lastName: string
  dob: string
  age: number
  gender: Gender
  idNumber: string
  flags: CharacterFlag[]
  user: UserMinDTO | null
}

export type CharacterListDTO = PaginatedResponse<CharacterListItemDTO>
