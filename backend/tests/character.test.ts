import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"
import {
  createCharacter,
  createCharacterWithRelations,
  getCharacterCreateInput,
} from "./factories/character.factory.js"
import { CharacterSearchRequest, UserRole } from "@project/shared"
import { register } from "./factories/user.factory.js"
import { characterCreateData } from "./constants/character.js"

describe("POST /characters/search", () => {
  it("returns 404, when character not found", async () => {
    const { access } = await register(UserRole.POLICE)
    const toSend: CharacterSearchRequest = {
      firstName: "test",
      lastName: "test",
      dob: "1990-01-22",
    }
    const res = await request(app)
      .post("/characters/search")
      .auth(access, { type: "bearer" })
      .send(toSend)
    console.log(res.body)

    expect(res.status).equal(404)
  })
  it("returns 400, when validation fails", async () => {
    const { access } = await register(UserRole.POLICE)
    const toSend = {
      firstName: "",
      last: "t",
      dob: "19-01-99",
    }
    const res = await request(app)
      .post("/characters/search")
      .auth(access, { type: "bearer" })
      .send(toSend)

    expect(res.status).equal(400)
    console.log(res.body)
  })
  it("returns 401, when unauthorized", async () => {
    const toSend: CharacterSearchRequest = {
      firstName: characterCreateData.firstName,
      lastName: characterCreateData.lastName,
      dob: characterCreateData.dob.toISOString().slice(0, 10),
    }

    const res = await request(app).post("/characters/search").send(toSend)

    expect(res.status).equal(401)
  })
  it("returns 403, when user has no permission", async () => {
    const { access } = await register()

    const toSend: CharacterSearchRequest = {
      firstName: characterCreateData.firstName,
      lastName: characterCreateData.lastName,
      dob: characterCreateData.dob.toISOString().slice(0, 10),
    }

    const res = await request(app)
      .post("/characters/search")
      .auth(access, { type: "bearer" })
      .send(toSend)

    expect(res.status).equal(403)
  })
  it("returns 200, when character exists", async () => {
    const { user, access } = await register(UserRole.POLICE)
    const characterInput = getCharacterCreateInput(user.id, characterCreateData)
    const character = await createCharacter(characterInput)
    console.log(character)

    const toSend: CharacterSearchRequest = {
      firstName: character.firstName,
      lastName: character.lastName,
      dob: character.dob.toISOString().slice(0, 10),
    }

    const res = await request(app)
      .post("/characters/search")
      .auth(access, { type: "bearer" })
      .send(toSend)
    console.log(res.body)

    expect(res.status).equal(200)
  })
})
