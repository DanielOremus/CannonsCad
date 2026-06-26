import { type ICharacterRepository } from "../interfaces/i.character.repository.js"
import { Prisma } from "../generated/prisma/client.js"
import {
  prisma,
  type DbClient,
  type ExtendedPrismaClient,
} from "../lib/prisma.js"
import type { CharacterCreateInput } from "../types/character.js"
import { type RawCharacter } from "../types/character.js"
import type { CharacterEntity } from "../domain/character.entity.js"
import { BaseRepository } from "./base.repository.js"
import type {
  CharacterFlag,
  Gender,
  LicenseCategory,
  CharacterSearchDTO,
  PaginationDTO,
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
      ...raw,
      gender: raw.gender as Gender,
      driverLicense: raw.driverLicense
        ? {
            id: raw.driverLicense.id,
            categories: raw.driverLicense.categories as LicenseCategory[],
          }
        : null,
      user: raw.user
        ? {
            id: raw.user.id,
            name: raw.user.name,
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
  async findByNameAndDob(
    dto: CharacterSearchDTO,
  ): Promise<CharacterEntity | null> {
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
  async create(
    data: CharacterCreateInput,
    client: DbClient = this.prisma,
  ): Promise<CharacterEntity> {
    const raw = await client.character.create({
      data,
      include: CHARACTER_INCLUDE,
    })
    return this.toDomain(raw)
  }
  async findByIdNumber(idNumber: string): Promise<CharacterEntity | null> {
    const raw = await this.prisma.character.findUnique({
      where: { idNumber },
      include: CHARACTER_INCLUDE,
    })
    return raw ? this.toDomain(raw) : null
  }
  async findMany(
    pagination: PaginationDTO,
    userId?: string,
  ): Promise<{ items: CharacterEntity[]; total: number }> {
    const where = userId ? { userId } : {}
    const { limit, page } = pagination
    const skip = (page - 1) * limit
    const [raws, total] = await Promise.all([
      this.prisma.character.findMany({
        where,
        include: CHARACTER_INCLUDE,
        take: limit,
        skip,
      }),
      this.prisma.character.count({ where }),
    ])
    return { items: raws.map((c) => this.toDomain(c)), total: total }
  }
  async findById(id: number): Promise<CharacterEntity | null> {
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
