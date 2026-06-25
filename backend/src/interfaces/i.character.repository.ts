import type { CharacterSearchDTO } from "@project/shared"
import type { CharacterEntity } from "../domain/character.entity.js"
import type { CharacterCreateInput } from "../types/character.js"
import type { PaginationDTO } from "@project/shared"
import type { DbClient } from "../lib/prisma.js"

export interface ICharacterRepository {
  create(data: CharacterCreateInput, client?: DbClient): Promise<CharacterEntity>
  findByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterEntity | null>
  findByIdNumber(idNumber: string): Promise<CharacterEntity | null>
  findById(id: number): Promise<CharacterEntity | null>
  findMany(
    pagination: PaginationDTO,
    userId?: string,
  ): Promise<{ items: CharacterEntity[]; total: number }>
}
