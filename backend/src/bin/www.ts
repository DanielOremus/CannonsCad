import app from "../app.js"
import http from "http"
import { Logger } from "../utils/logger.js"
import { appConfig } from "../config/app.js"
import type { Application } from "express"
import { mailer } from "../lib/mailer.js"

class Server {
  private app: Application
  private port: Number
  private server!: http.Server
  constructor(appInstance: Application) {
    this.app = appInstance
    this.port = this.normalizePort(appConfig.port)
  }
  async setup() {
    this.server = http.createServer(this.app)
    this.app.set("port", this.port)
    await this.verifyMailer()
  }
  async start() {
    await this.setup()
    this.server.listen(this.port)
    this.server.on("error", this.onError.bind(this))
    this.server.on("listening", this.onListening.bind(this))
  }
  async verifyMailer() {
    try {
      await mailer.verify()
      Logger.info("Mailer is ready to work")
    } catch (error) {
      Logger.error("Failed to verify mailer transport", error)
      process.exit(1)
    }
  }
  normalizePort(v: string): Number {
    const port = parseInt(v, 10)

    if (isNaN(port) || port <= 0) {
      throw new Error("Port is invalid")
    }
    return port
  }
  onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
      throw error
    }

    const bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges")
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(bind + " is already in use")
        process.exit(1)
        break
      default:
        throw error
    }
  }

  onListening() {
    const address = this.server.address()
    if (!address) return
    const bind = typeof address === "string" ? "pipe " + address : "port " + address.port
    Logger.info("Listening on " + bind)
  }
}

new Server(app).start()
