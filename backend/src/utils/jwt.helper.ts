import jwt from "jsonwebtoken"
import { appConfig } from "../config/app.js"
import type { AccessTokenPayload, RefreshTokenPayload } from "../types/token.js"
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
  static generateRefreshToken(payload: RefreshTokenPayload): string {
    const tokenConfig = appConfig.tokens.refresh
    const token = jwt.sign(payload, tokenConfig.secret, {
      expiresIn: tokenConfig.expire,
    })
    return token
  }
  static generateAccessToken(payload: AccessTokenPayload): string {
    const tokenConfig = appConfig.tokens.access
    const token = jwt.sign(payload, tokenConfig.secret, {
      expiresIn: tokenConfig.expire,
    })
    return token
  }
  static generateTokens(data: AccessTokenPayload & RefreshTokenPayload) {
    const { jti, sub, role } = data
    const access = JWTHelper.generateAccessToken({
      sub,
      role,
    })
    const refresh = JWTHelper.generateRefreshToken({ jti, sub })
    return { access, refresh }
  }
}

export default JWTHelper
