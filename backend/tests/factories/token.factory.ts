import jwt, { JwtPayload } from "jsonwebtoken"
import { appConfig } from "../../src/config/app.js"
import { prisma } from "../../src/lib/prisma.js"
import ms, { type StringValue } from "ms"
import { v4 as uuidv4 } from "uuid"

export function generateRefresh(userId: number, jti: string = uuidv4()) {
  return jwt.sign({ sub: userId, jti }, appConfig.tokens.refresh.secret, {
    expiresIn: appConfig.tokens.refresh.expire as StringValue,
  })
}

export function generateAccess(userId: number) {
  return jwt.sign({ sub: userId }, appConfig.tokens.access.secret, {
    expiresIn: appConfig.tokens.access.expire as StringValue,
  })
}
export async function createDbRefreshToken(rawToken: string) {
  const decoded = jwt.verify(rawToken, appConfig.tokens.refresh.secret) as JwtPayload
  return await prisma.refreshToken.create({
    data: {
      jti: decoded.jti!,
      sub: parseInt(decoded.sub!),
      expiresAt: new Date(decoded.iat! * 1000 + ms(appConfig.tokens.refresh.expire as StringValue)),
    },
  })
}
export async function getUserRefreshTokens(userId: number) {
  return await prisma.refreshToken.findMany({ where: { sub: userId } })
}
