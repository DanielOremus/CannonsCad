import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { appConfig } from "../config/app.js"
import ms, { type StringValue } from "ms"
import type { AccessTokenPayload } from "../types/token.js"
import type { UserRole } from "@project/shared"
class JWTHelper {
  static tryGetFromBearer(bearer: string | undefined): jwt.JwtPayload | null {
    if (!bearer || !bearer.startsWith("Bearer ")) return null
    const token = bearer.slice(7)
    try {
      return jwt.verify(token, appConfig.tokens.access.secret) as jwt.JwtPayload
    } catch (error) {
      return null
    }
  }
  static tryVerify(
    token: string,
    type: "access" | "refresh",
  ): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, appConfig.tokens[type].secret) as jwt.JwtPayload
    } catch (error) {
      return null
    }
  }
  static generateRefreshToken(userId: number): {
    token: string
    jti: string
    expiresAt: Date
  } {
    const tokenConfig = appConfig.tokens.refresh
    const jti = uuidv4()
    const token = jwt.sign({ sub: userId, jti }, tokenConfig.secret, {
      expiresIn: tokenConfig.expire as StringValue,
    })
    return {
      token,
      jti,
      expiresAt: new Date(Date.now() + ms(tokenConfig.expire as StringValue)),
    }
  }
  static generateAccessToken(payload: AccessTokenPayload): string {
    const tokenConfig = appConfig.tokens.access
    const token = jwt.sign(payload, tokenConfig.secret, {
      expiresIn: tokenConfig.expire as StringValue,
    })
    return token
  }
  static generateTokens(userId: number, userRole: UserRole) {
    const access = JWTHelper.generateAccessToken({
      sub: userId,
      role: userRole,
    })
    const { token: refresh } = JWTHelper.generateRefreshToken(userId)
    return { access, refresh }
  }
}

export default JWTHelper
