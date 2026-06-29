import { type EmailConfirmationEntity } from "../domain/email.confirmation.entity.js"
import type { DbClient } from "../lib/prisma.js"
import type { EmailConfirmationCreateInput } from "../types/email.confirmation.js"
import { type IBaseRepository } from "./i.base.repository.js"

export interface IEmailConfirmationRepository extends IBaseRepository {
  create(data: EmailConfirmationCreateInput, client?: DbClient): Promise<EmailConfirmationEntity>
  incrementAttempt(email: string, client?: DbClient): Promise<void>
  deleteByEmail(email: string, client?: DbClient): Promise<void>
  findByEmail(email: string): Promise<EmailConfirmationEntity | null>
}
