import jwt from "jsonwebtoken"
import { appConfig } from "../../src/config/app.js"
import { prisma } from "../../src/lib/prisma.js"
import type { AccessPayload, RefreshPayload, RefreshCreateInput } from "../../src/types/token.js"

export function generateRefresh(payload: RefreshPayload) {
  return jwt.sign(payload, appConfig.tokens.refresh.secret, {
    expiresIn: appConfig.tokens.refresh.expire,
  })
}

export function generateAccess(payload: AccessPayload) {
  return jwt.sign(payload, appConfig.tokens.access.secret, {
    expiresIn: appConfig.tokens.access.expire,
  })
}
export async function createRefreshToken(data: RefreshCreateInput) {
  return await prisma.refreshToken.customCreate(data.sub)
}
export async function getUserRefreshTokens(userId: string) {
  return await prisma.refreshToken.findMany({ where: { sub: userId } })
}
