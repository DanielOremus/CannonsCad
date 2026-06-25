import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"
import { register } from "./factories/user.factory.js"
import { UserRole } from "@project/shared"

describe("GET /users/me", () => {
  it("returns 401, when user not authorized", async () => {
    const res = await request(app).get("/users/me")

    expect(res.status).equal(401)
  })

  it("returns 403, when !admin tries to get another user", async () => {
    const { access, user } = await register()
    const res = await request(app).get(`/users/${user.id}`).auth(access, { type: "bearer" })

    expect(res.status).equal(403)
  })

  it("returns 200, when trying to get own profile", async () => {
    const { access } = await register()
    const res = await request(app).get(`/users/me`).auth(access, { type: "bearer" })

    expect(res.status).equal(200)
  })

  it("returns 200, when admin tries to get another user", async () => {
    const { access, user } = await register(UserRole.ADMIN)
    const res = await request(app).get(`/users/${user.id}`).auth(access, { type: "bearer" })

    expect(res.status).equal(200)
  })
})
