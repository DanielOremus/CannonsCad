export const ErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  ALREADY_EXISTS: "ALREADY_EXISTS",
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
