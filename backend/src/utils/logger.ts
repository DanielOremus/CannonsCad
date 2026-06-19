import debug from "debug"

class Logger {
  private debugger: debug.Debugger
  constructor(namespace: string) {
    this.debugger = debug(namespace)
  }
  error(message: string, data: unknown): void {
    this.debugger("%O", { message, data })
  }
  info(data: any): void {
    this.debugger("%O", data)
  }
}

export default new Logger("app:backend")

export { debug }
