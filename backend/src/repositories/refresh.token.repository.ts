import type { RefreshTokenEntity } from "../domain/refresh.token.entity.js"
import type { RefreshToken } from "../generated/prisma/client.js"
import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import { prisma, type DbClient, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { RefreshCreateInput } from "../types/token.js"
import { BaseRepository } from "./base.repository.js"

class RefreshTokenRepository
  extends BaseRepository<RefreshTokenEntity, RefreshToken>
  implements IRefreshTokenRepository
{
  protected toDomain(raw: RefreshToken): RefreshTokenEntity {
    return {
      jti: raw.jti,
      sub: raw.sub,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    }
  }
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma)
  }
  async findByJti(jti: string): Promise<RefreshToken | null> {
    const token = await this.prisma.refreshToken.findUnique({ where: { jti } })
    return token ? this.toDomain(token) : null
  }
  async delete(jti: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { jti } })
  }
  async create(dto: RefreshCreateInput, client: DbClient = this.prisma): Promise<RefreshToken> {
    const token = await client.refreshToken.customCreate(dto.sub)
    return this.toDomain(token)
  }
  async deleteAllBySub(sub: string, client: DbClient = this.prisma): Promise<void> {
    await client.refreshToken.deleteMany({ where: { sub } })
  }
}

export default new RefreshTokenRepository(prisma)
