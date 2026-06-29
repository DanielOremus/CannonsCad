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
export async function createRefreshToken(sub: string) {
  return await prisma.refreshToken.create({
    data: { sub, expiresAt: new Date(Date.now() + appConfig.tokens.refresh.expire * 1000) },
  })
}
export async function getUserRefreshTokens(userId: string) {
  return await prisma.refreshToken.findMany({ where: { sub: userId } })
}
