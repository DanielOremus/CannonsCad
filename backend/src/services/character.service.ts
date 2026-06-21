import type {
  CharacterCreateDTO,
  CharacterSearchDTO,
} from "@project/shared/src/validators/character.schema.js"
import type { ICharacterRepository } from "../interfaces/i.character.repository.js"
import characterRepository from "../repositories/character.repository.js"
import { NotFoundError, ValidationError } from "../errors/app.error.js"
import CharacterMapper from "../mappers/character.mapper.js"
import type { CharacterCardDTO } from "@project/shared"
import type { CharacterEntity } from "../domain/character.entity.js"

class CharacterService {
  constructor(private characterRepository: ICharacterRepository) {}
  async getByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterCardDTO> {
    const character = await this.characterRepository.getByNameAndDob(dto)
    if (!character) throw new NotFoundError("Person")
    return CharacterMapper.toCardDTO(character)
  }
  async create(userId: number, dto: CharacterCreateDTO): Promise<CharacterCardDTO> {
    const exists = await this.characterRepository.getByIdNumber(dto.idNumber)
    if (exists) {
      throw new ValidationError([], "Character with this idNumber already exists")
    }
    const data = CharacterMapper.toCreateInput(userId, dto)
    const character = await this.characterRepository.create(data)
    return CharacterMapper.toCardDTO(character)
  }
}

export default new CharacterService(characterRepository)
