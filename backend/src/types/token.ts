export type AccessTokenPayload = { sub: number }
export type RefreshTokenPayload = AccessTokenPayload & { jti: string }
export type RefreshTokenCreateDTO = RefreshTokenPayload & { expiresAt: Date }
