import type { BaseEntity } from "./base.entity.js"

export type EmailConfirmationEntity = Readonly<
  BaseEntity & {
    email: string
    code: number
    createdAt: Date
  }
>
