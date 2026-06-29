import { createTransport } from "nodemailer"
import { mailerConfig } from "../config/mailer.js"
import { mailerDefaults } from "../config/mailer.js"

const transport = createTransport(mailerConfig, mailerDefaults)

export { transport as mailer }
