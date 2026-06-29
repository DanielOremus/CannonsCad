import app from "../app.js"
import http from "http"
import { Logger } from "../utils/logger.js"
import { appConfig } from "../config/app.js"
import type { Application } from "express"
import { verifyMailer } from "../lib/mailer.js"
import { connectRedis } from "../lib/redis.js"
import { startWorkers } from "../lib/bullmq.js"

class Server {
  private app: Application
  private port: number
  private server!: http.Server
  constructor(appInstance: Application) {
    this.app = appInstance
    this.port = this.normalizePort(appConfig.port)
  }
  private async bootstrapService(
    name: string,
    fn: Function,
    isAsync = true,
  ): Promise<void> {
    try {
      if (isAsync) fn()
      else await fn()
      Logger.info(`${name} is/are ready to work!`)
    } catch (error) {
      Logger.error(`Failed to start ${name}`, error)
      process.exit(1)
    }
  }
  async setup() {
    this.server = http.createServer(this.app)
    this.app.set("port", this.port)
    await this.bootstrapService("Redis", connectRedis)
    await this.bootstrapService("Redis", verifyMailer)
    await this.bootstrapService("Workers", startWorkers)
  }
  async start() {
    await this.setup()
    this.server.listen(this.port)
    this.server.on("error", this.onError.bind(this))
    this.server.on("listening", this.onListening.bind(this))
  }
  normalizePort(v: string): number {
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

    const bind =
      typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port

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
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + address.port
    Logger.info("Listening on " + bind)
  }
}

new Server(app).start()
