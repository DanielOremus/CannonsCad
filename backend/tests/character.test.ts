import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"
import {
  createCharacter,
  createCharacterWithRelations,
  getCharacterCreateInput,
} from "./factories/character.factory.js"
import { CharacterSearchRequest } from "@project/shared"
import { createUser } from "./factories/user.factory.js"
import { characterCreateData } from "./constants/character.js"

describe("POST /characters/search", () => {
  it("returns 404, when character not found", async () => {
    const toSend: CharacterSearchRequest = {
      firstName: "test",
      lastName: "test",
      dob: "1990-01-22",
    }
    const res = await request(app).post("/characters/search").send(toSend)
    console.log(res.body)

    expect(res.status).equal(404)
  })
  it("returns 400, when validation fails", async () => {
    const toSend = {
      firstName: "",
      last: "test",
      dob: "19-01-99",
    }
    const res = await request(app).post("/characters/search").send(toSend)

    expect(res.status).equal(400)
    console.log(res.body)
  })
  it("returns 200, when character found", async () => {
    const { id } = await createUser()
    const characterInput = getCharacterCreateInput(id, characterCreateData)
    const character = await createCharacterWithRelations(characterInput)
    console.log(character)

    const toSend: CharacterSearchRequest = {
      firstName: character.firstName,
      lastName: character.lastName,
      dob: character.dob.toISOString().slice(0, 10),
    }

    const res = await request(app).post("/characters/search").send(toSend)
    console.log(res.body)

    expect(res.status).equal(200)
  })
})
