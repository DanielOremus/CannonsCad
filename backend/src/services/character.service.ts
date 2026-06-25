import type {
  CharacterCreateDTO,
  CharacterSearchDTO,
} from "@project/shared/src/validators/character.schema.js"
import type { ICharacterRepository } from "../interfaces/i.character.repository.js"
import characterRepository from "../repositories/character.repository.js"
import { NotFoundError, ValidationError } from "../errors/app.error.js"
import CharacterMapper from "../mappers/character.mapper.js"
import type { CharacterCardDTO, PaginationDTO } from "@project/shared"
import type { CharacterListDTO } from "@project/shared/src/dtos/character.dto.js"

class CharacterService {
  constructor(private characterRepository: ICharacterRepository) {}
  async getByNameAndDob(dto: CharacterSearchDTO): Promise<CharacterCardDTO> {
    const character = await this.characterRepository.findByNameAndDob(dto)
    if (!character) throw new NotFoundError("Person")
    return CharacterMapper.toCardDTO(character)
  }
  async create(userId: string, dto: CharacterCreateDTO): Promise<CharacterCardDTO> {
    const exists = await this.characterRepository.findByIdNumber(dto.idNumber)
    if (exists) {
      throw new ValidationError([], "Character with this idNumber already exists")
    }
    const data = CharacterMapper.toCreateInput(userId, dto)
    const character = await this.characterRepository.create(data)
    return CharacterMapper.toCardDTO(character)
  }
  async getAllByUserId(userId: string, pagination: PaginationDTO): Promise<CharacterListDTO> {
    const { items, total } = await this.characterRepository.findMany(pagination, userId)

    return {
      items: items.map((i) => CharacterMapper.toListItemDTO(i)),
      meta: {
        limit: pagination.limit,
        page: pagination.page,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    }
  }
}

export default new CharacterService(characterRepository)
