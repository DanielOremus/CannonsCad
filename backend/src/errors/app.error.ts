import type z from "zod/v4"
import { ErrorCode } from "@project/shared"

export class AppError extends Error {
  constructor(
    readonly message: string,
    readonly statusCode: number = 500,
    readonly errorCode?: ErrorCode,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} not found`, 404, ErrorCode.NOT_FOUND)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, ErrorCode.UNAUTHORIZED)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, ErrorCode.FORBIDDEN)
  }
}

export class ValidationError extends AppError {
  constructor(
    public issues: z.core.$ZodIssue[],
    message: string = "Validation failed",
  ) {
    super(message, 400, ErrorCode.VALIDATION_FAILED)
  }
}
