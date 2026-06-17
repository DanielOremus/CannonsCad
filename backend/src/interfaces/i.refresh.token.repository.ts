import type { RefreshToken } from "../generated/prisma/client.js"
import type { RefreshTokenCreateDTO } from "../types/token.js"

export interface IRefreshTokenRepository {
  create(dto: RefreshTokenCreateDTO): Promise<RefreshToken>
  deleteAllBySub(sub: number): Promise<void>
  getByJti(jti: string): Promise<RefreshToken | null>
  delete(jti: string): Promise<void>
}
