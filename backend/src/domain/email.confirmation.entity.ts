import type { BaseEntity } from "./base.entity.js"

export type EmailConfirmationEntity = BaseEntity & {
  email: string
  code: number
  createdAt: Date
}
