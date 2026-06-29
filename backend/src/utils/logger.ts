import debug from "debug"

class LoggerClass {
  private debugger: debug.Debugger
  constructor(namespace: string) {
    this.debugger = debug(namespace)
  }
  error(message: string, data: unknown): void {
    this.debugger(`${message}\n%O`, data)
  }
  info(data: unknown): void {
    this.debugger("%O", data)
  }
}

export const Logger = new LoggerClass("app:backend")

export function createLogger(namespace: string) {
  return new LoggerClass(namespace)
}
