import { createTransport } from "nodemailer"
import { mailerConfig } from "../config/mailer.js"

const transport = createTransport(mailerConfig)

export { transport as mailer }
