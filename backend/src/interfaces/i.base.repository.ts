import type { ExtendedTransactionClient } from "../lib/prisma.js"

export interface IBaseRepository {
  transaction<T>(fn: (tx: ExtendedTransactionClient) => Promise<T>): Promise<T>
}
