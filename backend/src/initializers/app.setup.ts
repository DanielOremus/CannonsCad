import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import express from "express"
import type { Application } from "express"

export default function (app: Application) {
  app.set("views", path.join(process.cwd(), "dist/views"))
  app.set("view engine", "ejs")

  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(import.meta.dirname, "../public")))
}
