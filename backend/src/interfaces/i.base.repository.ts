export interface IBaseRepository<TEntity> {
  getById(id: number): Promise<TEntity | null>
  delete(id: number): Promise<void>
}
