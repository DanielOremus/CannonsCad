export type RefreshTokenEntity = Readonly<{
  jti: string
  sub: string
  expiresAt: Date
  createdAt: Date
}>
