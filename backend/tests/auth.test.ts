import request from "supertest"
import app from "../src/app.js"
import { describe, it, expect } from "vitest"
import { createUser, getUserByEmail } from "./factories/user.factory.js"
import {
  createRefreshToken,
  generateRefresh,
  getUserRefreshTokens,
} from "./factories/token.factory.js"

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
    const res = await request(app).post("/auth/login").send({ email: user.email, password: "test" })
    expect(res.status).equal(200)
    expect(res.body.access).toBeDefined()
    expect(res.body.user).toBeDefined()
  })
})

describe("POST /auth/register", () => {
  it("returns 409, user already exists", async () => {
    const { email } = await createUser()
    const res = await request(app).post("/auth/register").send({
      email,
      name: "TestUser",
      password: "test",
      confirmPassword: "test",
    })
    expect(res.status).equal(409)
  })

  it("returns 201, user registered", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@gmail.com",
      name: "TestUser",
      password: "test",
      confirmPassword: "test",
    })
    const dbUser = await getUserByEmail("test@gmail.com")
    const cookies = res.headers["set-cookie"]
    console.log(cookies)

    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^refresh=/)]),
    )
    expect(dbUser).toBeTruthy()
    expect(res.status).equal(201)
    expect(res.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        access: expect.any(String),
      }),
    )
  })
})

describe("POST /auth/refresh", () => {
  it("returns 401, when refresh token is invalid", async () => {
    const res = await request(app).post("/auth/refresh")

    expect(res.status).equal(401)
  })

  it("returns 401, when refresh token has invalid jti", async () => {
    const user = await createUser()
    await createRefreshToken({ sub: user.id })

    const badToken = generateRefresh({ sub: user.id, jti: "bad-jti" })

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh=${badToken}`])

    const userTokens = await getUserRefreshTokens(user.id)

    expect(res.status).equal(401)
    expect(userTokens.length).toEqual(0)
  })

  it("returns 200, when refresh token is valid", async () => {
    const user = await createUser()
    const dbToken = await createRefreshToken({ sub: user.id })
    const goodToken = generateRefresh({ jti: dbToken.jti, sub: user.id })

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
