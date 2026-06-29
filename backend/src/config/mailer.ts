const transportConfig = {
  get host() {
    if (!process.env.SMTP_HOST) throw new Error("No smtp host provided")
    return process.env.SMTP_HOST
  },
  get port() {
    if (!process.env.SMTP_PORT) return 587
    return parseInt(process.env.SMTP_PORT)
  },
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    get user() {
      if (!process.env.SMTP_USER) throw new Error("No smtp user provided")
      return process.env.SMTP_USER
    },
    get pass() {
      if (!process.env.SMTP_PASS) throw new Error("Np smtp pass provided")
      return process.env.SMTP_PASS
    },
  },
  tls: {
    rejectUnauthorized: !["test", "development"].includes(process.env.ENV!),
  },
} as const

const defaults = {
  from: `${process.env.SMTP_USER_NAME} <${process.env.SMTP_USER}>`,
}
export { transportConfig as mailerConfig }
export { defaults as mailerDefaults }
