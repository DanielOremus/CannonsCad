export type EmailConfirmationEntity = Readonly<{
  email: string
  code: string
  attempts: number
  createdAt: Date
  expiresAt: Date
}>
