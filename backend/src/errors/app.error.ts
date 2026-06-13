export class AppError extends Error {
  constructor(
    readonly message: string,
    readonly statusCode: number,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(message, 401)
  }
}
