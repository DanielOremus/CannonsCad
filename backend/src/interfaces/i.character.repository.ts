import type { IBaseRepository } from "./i.base.repository.js"
import type { CharacterSearchDTO } from "@project/shared/src/validators/character.schema.js"
import type { CharacterEntity } from "../domain/character.entity.js"
import type { CharacterCreateInput } from "../types/character.js"

export interface ICharacterRepository extends IBaseRepository<CharacterEntity> {
  create(data: CharacterCreateInput): Promise<CharacterEntity>
  getByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterEntity | null>
  getByIdNumber(idNumber: string): Promise<CharacterEntity | null>
}
