import type { CharacterSearchDTO } from "@project/shared/src/validators/character.schema.js"
import type { ICharacterRepository } from "../interfaces/i.character.repository.js"
import characterRepository from "../repositories/character.repository.js"
import { NotFoundError } from "../errors/app.error.js"
import CharacterMapper from "../mappers/character.mapper.js"
import type { CharacterCardDTO } from "@project/shared"

class CharacterService {
  constructor(private characterRepository: ICharacterRepository) {}
  async getByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterCardDTO> {
    const character = await this.characterRepository.getByNameAndDob(dto)
    if (!character) throw new NotFoundError("Person")
    return CharacterMapper.toCardDTO(character)
  }
}

export default new CharacterService(characterRepository)
