import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"
import { createUser } from "./factories/user.factory.js"
import { generateAccess } from "./factories/token.factory.js"
import { UserRole, UserStatus } from "@project/shared"

describe("GET /users/me", () => {
  it("returns 401, when user not authorized", async () => {
    const res = await request(app).get("/users/me")

    expect(res.status).equal(401)
  })

  it("returns 403, when !admin tries to get another user", async () => {
    const user = await createUser()
    const access = generateAccess({ sub: user.id, role: user.role })
    const res = await request(app)
      .get(`/users/${user.id}`)
      .auth(access, { type: "bearer" })

    expect(res.status).equal(403)
  })

  it("returns 200, when trying to get own profile", async () => {
    const user = await createUser(UserStatus.PENDING)
    const access = generateAccess({ sub: user.id, role: user.role })
    const res = await request(app)
      .get(`/users/me`)
      .auth(access, { type: "bearer" })

    expect(res.status).equal(200)
  })

  it("returns 200, when admin tries to get another user", async () => {
    const user = await createUser(UserStatus.APPROVED, UserRole.ADMIN)
    const access = generateAccess({ sub: user.id, role: user.role })
    const res = await request(app)
      .get(`/users/${user.id}`)
      .auth(access, { type: "bearer" })

    expect(res.status).equal(200)
  })
})
