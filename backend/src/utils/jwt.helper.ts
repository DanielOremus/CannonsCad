import * as jwt from "jsonwebtoken"
import { appConfig } from "../config/app.js"
import type { StringValue } from "ms"
class JWTHelper {
  static async tryGetFromBearer(
    bearer: string,
  ): Promise<{ success: boolean; decoded: jwt.JwtPayload | null }> {
    if (!bearer.startsWith("Bearer ")) return { success: false, decoded: null }
    const token = bearer.slice(7)
    const decoded = jwt.verify(
      token,
      appConfig.tokens.access.secret,
    ) as jwt.JwtPayload
    return { success: true, decoded }
  }
  static async generateToken(userId: number, type: "refresh" | "access") {
    const tokenConfig = appConfig.tokens[type]

    return jwt.sign({ sub: userId }, tokenConfig.secret, {
      expiresIn: tokenConfig.expire as StringValue,
    })
  }
}

export default JWTHelper
