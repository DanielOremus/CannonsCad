import type { CharacterCreateDTO } from "@project/shared"
import type { Character } from "../generated/prisma/client.js"
import type { IBaseRepository } from "./i.base.repository.js"
import type { CharacterSearchDTO } from "@project/shared/src/validators/character.schema.js"

export interface ICharacterRepository extends IBaseRepository<Character> {
  create(dto: CharacterCreateDTO): Promise<Character>
  getByNameAndDob(dto: CharacterSearchDTO): Promise<Character | null>
}
