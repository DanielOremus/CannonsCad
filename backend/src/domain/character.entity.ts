import type { CharacterFlag, Gender } from "@project/shared"
import type { BaseEntity } from "./base.entity.js"
import type { UserEntity } from "./user.entity.js"
import type { VehicleEntity } from "./vehicle.entity.js"
import type { DriverLicenseEntity } from "./driver.license.entity.js"

export type CharacterEntity = Readonly<
  BaseEntity & {
    firstName: string
    lastName: string
    dob: Date
    age: number
    gender: Gender
    idNumber: string
    driverLicense: DriverLicenseEntity | null
    phoneNumber: string | null
    address: string | null
    hasGunPermit: boolean
    flags: CharacterFlag[]
    user: Omit<UserEntity, "passwordHash"> | null
    vehicles: VehicleEntity[]
  }
>
