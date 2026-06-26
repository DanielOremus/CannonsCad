import { type EmailConfirmationEntity } from "../domain/email.confirmation.entity.js"

export type EmailConfirmationCreateInput = Pick<
  EmailConfirmationEntity,
  "email" | "code"
>
