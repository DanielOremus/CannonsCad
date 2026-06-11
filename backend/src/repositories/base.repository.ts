//!!Deprecated

// import type { PrismaClient } from "../generated/prisma/client.js"
// import type { IBaseRepository } from "../interfaces/i.base.repository.js"
// import type { Model } from "../types/model.js"

// abstract class BaseRepository<T extends keyof Model> implements IBaseRepository<T> {
//   private model: T
//   constructor(
//     dbClient: PrismaClient,
//     modelName: keyof Omit<
//       PrismaClient,
//       | "$connect"
//       | "$disconnect"
//       | "$executeRaw"
//       | "$executeRawUnsafe"
//       | "$extends"
//       | "$on"
//       | "$queryRaw"
//       | "$queryRawUnsafe"
//       | "$transaction"
//     >,
//   ) {
//     this.model = dbClient[modelName]
//   }
//   async getById(id: number | string): Promise<T | null> {
//     const item = await this.model.
//     return item
//   }
//   async getAll(): Promise<T[]> {
//     const items = await this.model.findMany()
//     return items
//   }
//   async create(entity: T): Promise<T> {
//     throw new Error("Method not implemented.")
//   }
//   async update(entity: T): Promise<T> {
//     throw new Error("Method not implemented.")
//   }
//   async deleteById(id: number | string): Promise<void> {
//     throw new Error("Method not implemented.")
//   }
// }

// export default BaseRepository
