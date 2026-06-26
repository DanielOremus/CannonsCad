import { BaseRepository } from "./base.repository.js"
import { type IEmailConfirmationRepository } from "../interfaces/i.email.confirmation.repository.js"
import type { EmailConfirmationEntity } from "../domain/email.confirmation.entity.js"
import type { EmailConfirmation } from "../generated/prisma/client.js"
import {
  prisma,
  type DbClient,
  type ExtendedPrismaClient,
} from "../lib/prisma.js"
import type { EmailConfirmationCreateInput } from "../types/email.confirmation.js"

class EmailConfirmationRepository
  extends BaseRepository<EmailConfirmationEntity, EmailConfirmation>
  implements IEmailConfirmationRepository
{
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma)
  }
  protected toDomain(raw: EmailConfirmation): EmailConfirmationEntity {
    return { ...raw }
  }
  async create(
    data: EmailConfirmationCreateInput,
    client: DbClient = this.prisma,
  ): Promise<EmailConfirmationEntity> {
    const raw = await client.emailConfirmation.create({ data })
    return this.toDomain(raw)
  }
  update(): Promise<EmailConfirmationEntity> {
    throw new Error("Method not implemented.")
  }
  async delete(id: number, client: DbClient = this.prisma): Promise<void> {
    await client.emailConfirmation.delete({ where: { id } })
  }
  findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    throw new Error("Method not implemented.")
  }
}

export default new EmailConfirmationRepository(prisma)
