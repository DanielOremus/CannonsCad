import type { RefreshTokenEntity } from "../domain/refresh.token.entity.js"

export type AccessPayload = { sub: string }
export type RefreshPayload = Pick<RefreshTokenEntity, "sub" | "jti">

export type RefreshCreateInput = Pick<RefreshTokenEntity, "sub" | "expiresAt">
