import type { Request, Response, NextFunction } from "express"
import { ZodError, type ZodType } from "zod/v4"
import { ValidationError } from "../../errors/app.error.js"

export function validateBody(schema: ZodType) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(new ValidationError(result.error.issues))
    }
    req.body = result.data
    next()
  }
}
