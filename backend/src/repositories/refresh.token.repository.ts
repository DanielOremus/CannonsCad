import type { RefreshToken } from "../generated/prisma/client.js"
import type { IRefreshTokenRepository } from "../interfaces/i.refresh.token.repository.js"
import { prisma, type ExtendedPrismaClient } from "../lib/prisma.js"
import type { RefreshTokenCreateDTO } from "../types/token.js"

class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private prisma: ExtendedPrismaClient) {}
  async getByJti(jti: string): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findUnique({ where: { jti } })
  }
  async delete(jti: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { jti } })
  }
  async create(dto: RefreshTokenCreateDTO): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.create({
      data: dto,
    })
    return token
  }
  async deleteAllBySub(sub: number): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { sub } })
  }
}

export default new RefreshTokenRepository(prisma)
