import type { Request, Response, NextFunction } from "express"
import { ZodError, type ZodType } from "zod/v4"
import { ValidationError } from "../../errors/app.error.js"

export function validate(schema: ZodType) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const data = schema.parse(req.body)
      req.body = data
      next()
    } catch (error) {
      if (error instanceof ZodError) return next(new ValidationError(error.issues))
      next(new ValidationError([]))
    }
  }
}
