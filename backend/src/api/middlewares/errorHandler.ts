import createError, { type HttpError } from "http-errors"
import { appConfig } from "../../config/app.js"
import type { Request, Response, NextFunction } from "express"
import { AppError, ValidationError } from "../../errors/app.error.js"

export function catchNotFound(req: Request, res: Response, next: NextFunction) {
  next(createError(404))
}

export function catchAsync(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next)
  }
}

export function globalErrorHandler(
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // set locals, only providing error in development
  const isProd = appConfig.env === "production"

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message, issues: err.issues })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }
  const message = isProd ? "Something went wrong, please try again later" : err.message
  const status = "status" in err ? err.status : 500

  // if (isProd) {
  return res.status(status).json({ message })
  // }
  // render the error page
  res.status(status)
  res.locals.message = err.message
  res.locals.error = err
  res.render("error")
}
