import type { UserRole } from "@project/shared"

export type AccessTokenPayload = { sub: number; role: UserRole }
export type RefreshTokenPayload = Omit<AccessTokenPayload, "role"> & {
  jti: string
}
export type RefreshTokenCreateDTO = RefreshTokenPayload & { expiresAt: Date }
