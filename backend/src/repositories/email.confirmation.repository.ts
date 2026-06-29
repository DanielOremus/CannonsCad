import { BaseRepository } from "./base.repository.js"
import { type IEmailConfirmationRepository } from "../interfaces/i.email.confirmation.repository.js"
import type { EmailConfirmationEntity } from "../domain/email.confirmation.entity.js"
import type { EmailConfirmation } from "../generated/prisma/client.js"
import { prisma, type DbClient, type ExtendedPrismaClient } from "../lib/prisma.js"
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
  async incrementAttempt(email: string, client: DbClient = this.prisma): Promise<void> {
    await client.emailConfirmation.update({
      where: { email },
      data: {
        attempts: {
          increment: 1,
        },
      },
    })
  }
  async deleteByEmail(email: string, client: DbClient = this.prisma): Promise<void> {
    await client.emailConfirmation.delete({ where: { email } })
  }
  async findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    const raw = await this.prisma.emailConfirmation.findUnique({ where: { email } })
    return raw ? this.toDomain(raw) : null
  }
}

export default new EmailConfirmationRepository(prisma)
