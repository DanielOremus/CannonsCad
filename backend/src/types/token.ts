import type { UserRole } from "@project/shared"

export type AccessTokenPayload = { sub: number; role: UserRole }
export type RefreshTokenPayload = { sub: number; jti: string }

export type RefreshTokenCreateDTO = { sub: number }
