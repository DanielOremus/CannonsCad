export type AccessTokenPayload = { sub: number }
export type RefreshTokenPayload = { sub: number; jti: string }

export type RefreshTokenCreateDTO = { sub: number }
