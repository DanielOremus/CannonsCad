import { type ICharacterRepository } from "../interfaces/i.character.repository.js"
import { Prisma } from "../generated/prisma/client.js"
import { prisma, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { CharacterCreateInput } from "../types/character.js"
import { type RawCharacter } from "../types/character.js"
import type { CharacterEntity } from "../domain/character.entity.js"
import { BaseRepository } from "./base.repository.js"
import type {
  CharacterFlag,
  Gender,
  LicenseCategory,
  UserRole,
  UserStatus,
  CharacterSearchDTO,
} from "@project/shared"
import type { VehicleEntity } from "../domain/vehicle.entity.js"

const CHARACTER_INCLUDE = {
  driverLicense: true,
  user: true,
  vehicles: true,
} satisfies Prisma.CharacterInclude

class CharacterRepository
  extends BaseRepository<CharacterEntity, RawCharacter>
  implements ICharacterRepository
{
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma)
  }
  protected toDomain(raw: NonNullable<RawCharacter>): CharacterEntity {
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      dob: raw.dob,
      age: raw.age,
      gender: raw.gender as Gender,
      idNumber: raw.idNumber,
      driverLicense: raw.driverLicense
        ? {
            id: raw.driverLicense.id,
            categories: raw.driverLicense.categories as LicenseCategory[],
          }
        : null,
      phoneNumber: raw.phoneNumber,
      address: raw.address,
      hasGunPermit: raw.hasGunPermit,
      user: raw.user
        ? {
            id: raw.user.id,
            name: raw.user.name,
            email: raw.user.email,
            role: raw.user.role as UserRole,
            status: raw.user.status as UserStatus,
            createdAt: raw.user.createdAt,
          }
        : null,
      flags: raw.flags as CharacterFlag[],
      vehicles: raw.vehicles.map((v) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year,
      })) as VehicleEntity[],
    }
  }
  async getByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterEntity | null> {
    const raw = await this.prisma.character.findFirst({
      where: {
        AND: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          dob: dto.dob,
        },
      },
      include: CHARACTER_INCLUDE,
    })
    return raw ? this.toDomain(raw) : null
  }
  async create(data: CharacterCreateInput): Promise<CharacterEntity> {
    const raw = await this.prisma.character.create({ data, include: CHARACTER_INCLUDE })
    return this.toDomain(raw)
  }
  async getByIdNumber(idNumber: string): Promise<CharacterEntity | null> {
    const raw = await this.prisma.character.findUnique({
      where: { idNumber },
      include: CHARACTER_INCLUDE,
    })
    return raw ? this.toDomain(raw) : null
  }
  async getById(id: number): Promise<CharacterEntity | null> {
    const raw = await this.prisma.character.findUnique({
      where: { id },
      include: CHARACTER_INCLUDE,
    })
    return raw ? this.toDomain(raw) : null
  }
  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default new CharacterRepository(prisma)
