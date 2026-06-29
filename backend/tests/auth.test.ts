import request from "supertest"
import app from "../src/app.js"
import { describe, it, expect } from "vitest"
import { createUser } from "./factories/user.factory.js"
import {
  createRefreshToken,
  generateRefresh,
  getUserRefreshTokens,
} from "./factories/token.factory.js"
import { randomUUID } from "node:crypto"
import { userCreateData } from "./constants/user.js"

describe("POST /auth/login", () => {
  it("returns 401, when user not found", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "abc@gmail.com", password: "1234" })
    expect(res.status).equal(401)
  })

  it("returns 401, when password is incorrect", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "incorrectPass" })
    expect(res.status).equal(401)
  })

  it("returns 200, user logged in", async () => {
    const user = await createUser()
    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: userCreateData.password })
    expect(res.status).equal(200)
    expect(res.body.access).toBeDefined()
    expect(res.body.user).toBeDefined()
  })
})

describe("POST /auth/register", () => {
  it("returns 409, user already exists", async () => {
    const { email, name } = await createUser()
    const res = await request(app).post("/auth/register").send({
      email,
      name,
      password: userCreateData.password,
      confirmPassword: userCreateData.password,
    })
    expect(res.status).equal(409)
  })

  it("returns 201, user registered", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        ...userCreateData,
        confirmPassword: userCreateData.password,
      })
    const cookies = res.headers["set-cookie"]
    console.log(cookies)

    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^refresh=/)]),
    )
    expect(res.status).equal(201)
    expect(res.body.access).toBeDefined()
    expect(res.body.user).toBeDefined()
  })
})

describe("POST /auth/refresh", () => {
  it("returns 401, when refresh token is invalid", async () => {
    const res = await request(app).post("/auth/refresh")

    expect(res.status).equal(401)
  })

  it("returns 401, when refresh token has invalid jti", async () => {
    const { id } = await createUser()
    await createRefreshToken(id)

    const badToken = generateRefresh({ sub: id, jti: randomUUID() })

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh=${badToken}`])

    const userTokens = await getUserRefreshTokens(id)

    expect(res.status).equal(401)
    expect(userTokens.length).toEqual(0)
  })

  it("returns 200, when refresh token is valid", async () => {
    const { id } = await createUser()
    const dbToken = await createRefreshToken(id)
    const goodToken = generateRefresh({ jti: dbToken.jti, sub: id })

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh=${goodToken}`])

    expect(res.status).equal(200)
    expect(res.body).toBeTypeOf("string")
    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^refresh=/)]),
    )
  })
})
