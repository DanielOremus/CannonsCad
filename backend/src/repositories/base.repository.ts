import type { IBaseRepository } from "../interfaces/i.base.repository.js"
import type { ExtendedTransactionClient, ExtendedPrismaClient } from "../lib/prisma.js"

export abstract class BaseRepository<TEntity, TRaw> implements IBaseRepository {
  protected abstract toDomain(raw: TRaw): TEntity
  public async transaction<T>(fn: (tx: ExtendedTransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }
  protected constructor(protected prisma: ExtendedPrismaClient) {}
}
