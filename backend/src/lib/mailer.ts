import { createTransport } from "nodemailer"
import { mailerConfig } from "../config/mailer.js"
import { mailerDefaults } from "../config/mailer.js"

const transporter = createTransport(mailerConfig, mailerDefaults)

export { transporter as mailer }

export async function verifyMailer(): Promise<void> {
  await transporter.verify()
}
