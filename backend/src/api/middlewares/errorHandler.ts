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
  const isDev = appConfig.env === "development"
  let errMessage: string
  let errStatus: number

  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      if (!isDev)
        return res.status(err.statusCode).json({ message: err.message, issues: err.issues })
    } else {
      if (!isDev) return res.status(err.statusCode).json({ message: err.message })
    }
    errMessage = err.message
    errStatus = err.statusCode
  } else {
    errMessage = err.message
    errStatus = "status" in err ? err.status : 500
  }
  // render the error page
  res.status(errStatus)
  res.locals.message = errMessage
  res.locals.error = err
  res.render("error")
}
