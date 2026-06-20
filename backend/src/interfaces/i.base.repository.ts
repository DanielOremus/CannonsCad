export interface IBaseRepository<T> {
  getById(id: number): Promise<T | null>
  //   getAll(): Promise<T[]>
  //   create(entity: T): Promise<T>
  //   update(entity: T): Promise<T>
  delete(id: number): Promise<void>
}
