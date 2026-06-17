import request from "supertest"
import app from "../src/app.js"
import { describe, it, expect } from "vitest"
import { createUser, getUserByEmail } from "./factories/user.factory.js"
import {
  createDbRefreshToken,
  generateRefresh,
  getUserRefreshTokens,
} from "./factories/token.factory.js"

describe.skip("POST /auth/login", () => {
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
    console.log(user)
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "test" })
    expect(res.status).equal(200)
    expect(res.body.access).toBeDefined()
    expect(res.body.user).toBeDefined()
  })
})

describe.skip("POST /auth/register", () => {
  it("returns 409, user already exists", async () => {
    await createUser()
    const res = await request(app).post("/auth/register").send({
      email: "test@gmail.com",
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
      expect.objectContaining({ user: expect.any(Object), access: expect.any(String) }),
    )
  })
})

describe.skip("POST /auth/refresh", () => {
  it("returns 401, when refresh token is invalid", async () => {
    const res = await request(app).post("/auth/refresh")

    expect(res.status).equal(401)
  })

  it("returns 401, when refresh token has invalid jti", async () => {
    const user = await createUser()
    const goodToken = generateRefresh(user.id)
    const dbToken = await createDbRefreshToken(goodToken)
    console.log("Created refresh -------")
    console.log(dbToken)

    const badToken = generateRefresh(user.id, "bad-jti")

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh=${badToken}`])

    console.log("Tokens after bad refresh -------")
    const userTokens = await getUserRefreshTokens(user.id)
    console.log(userTokens)

    expect(res.status).equal(401)
    expect(userTokens.length).toEqual(0)
  })

  it("returns 200, when refresh token is valid", async () => {
    const user = await createUser()
    const goodToken = generateRefresh(user.id)
    const dbToken = await createDbRefreshToken(goodToken)
    console.log("Created refresh -------")
    console.log(dbToken)

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh=${goodToken}`])

    expect(res.status).equal(200)
    expect(res.body).toBeTypeOf("string")
  })
})
