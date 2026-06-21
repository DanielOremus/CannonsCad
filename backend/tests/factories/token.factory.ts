import jwt from "jsonwebtoken"
import { appConfig } from "../../src/config/app.js"
import { prisma } from "../../src/lib/prisma.js"
import type {
  AccessTokenPayload,
  RefreshTokenCreateDTO,
  RefreshTokenPayload,
} from "../../src/types/token.js"

export function generateRefresh(payload: RefreshTokenPayload) {
  return jwt.sign(payload, appConfig.tokens.refresh.secret, {
    expiresIn: appConfig.tokens.refresh.expire,
  })
}

export function generateAccess(payload: AccessTokenPayload) {
  return jwt.sign(payload, appConfig.tokens.access.secret, {
    expiresIn: appConfig.tokens.access.expire,
  })
}
export async function createRefreshToken(dto: RefreshTokenCreateDTO) {
  return await prisma.refreshToken.customCreate(dto.sub)
}
export async function getUserRefreshTokens(userId: number) {
  return await prisma.refreshToken.findMany({ where: { sub: userId } })
}
