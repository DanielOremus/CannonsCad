import type { RefreshTokenEntity } from "../domain/refresh.token.entity.js"
import type { DbClient } from "../lib/prisma.js"
import type { RefreshCreateInput } from "../types/token.js"

export interface IRefreshTokenRepository {
  create(dto: RefreshCreateInput, client?: DbClient): Promise<RefreshTokenEntity>
  deleteAllBySub(sub: string, client?: DbClient): Promise<void>
  findByJti(jti: string): Promise<RefreshTokenEntity | null>
  delete(jti: string): Promise<void>
}
