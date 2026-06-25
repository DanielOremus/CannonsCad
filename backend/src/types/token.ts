export type AccessPayload = { sub: string }
export type RefreshPayload = { sub: string; jti: string }

export type RefreshCreateInput = { sub: string }
