import createError, { type HttpError } from "http-errors"
import { appConfig } from "../../config/app.js"
import type { Request, Response, NextFunction } from "express"

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
  const status = "status" in err ? err.status : 500
  // render the error page
  res.status(status)
  if (!isProd) {
    res.locals.message = err.message
    res.locals.error = err
    res.render("error")
  } else res.json({ message: "Something went wrong, please try again later" })
}
