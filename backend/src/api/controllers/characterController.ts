import type { Request, Response } from "express"
import characterService from "../../services/character.service.js"
import type CharacterService from "../../services/character.service.js"
import type { CharacterCreateDTO, CharacterSearchDTO } from "@project/shared"

class CharacterController {
  constructor(private characterService: typeof CharacterService) {}
  search = async (req: Request<{}, {}, CharacterSearchDTO>, res: Response) => {
    const character = await this.characterService.getByNameAndDob(req.body)
    res.json(character)
  }
  create = async (req: Request<{}, {}, CharacterCreateDTO>, res: Response) => {
    const character = await this.characterService.create(res.locals.user.id, req.body)
    res.json(character)
  }
}

export default new CharacterController(characterService)
