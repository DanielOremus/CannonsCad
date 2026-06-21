import type { ExtendedPrismaClient } from "../lib/prisma.js"

export abstract class BaseRepository<TEntity, TRaw> {
  protected abstract toDomain(raw: TRaw): TEntity
  protected constructor(protected prisma: ExtendedPrismaClient) {}
}
