import ejs from "ejs"
import { mailer } from "../lib/mailer.js"
import type { SentMessageInfo, Transporter } from "nodemailer"
import path from "node:path"
import { AppError } from "../errors/app.error.js"

type NotificationPayloads = {
  emailConfirm: { target: string; userName: string; expiresIn: string; code: string }
  emailChange: NotificationPayloads["emailConfirm"] & { preventLink: string; oldEmail: string }
  emailChangeSuccess: { target: string; userName: string }
}

type NotificationType = keyof NotificationPayloads

class EmailSender {
  constructor(private transport: Transporter) {}
  private templatesPaths = {
    emailConfirmation: path.join(import.meta.dirname, "../views/templates/email.confirmation.ejs"),
  }
  private handlers: {
    [K in NotificationType]: (payload: NotificationPayloads[K]) => Promise<void>
  } = {
    emailConfirm: this.sendEmailConfirm.bind(this),
    emailChange: this.sendEmailChange.bind(this),
    emailChangeSuccess: this.sendEmailChangeSuccess.bind(this),
  }
  private checkRejectedAndThrow(info: SentMessageInfo) {
    if (info.rejected.length > 0) {
      throw new AppError("Failed to send email")
    }
  }
  private async sendEmailConfirm(payload: NotificationPayloads["emailConfirm"]) {
    const { userName, target, code, expiresIn } = payload
    const template = await ejs.renderFile(this.templatesPaths.emailConfirmation, {
      code,
      userName,
      expiresIn,
    })
    const info = await this.transport.sendMail({
      to: target,
      html: template,
      subject: "Confirm your Email - CannonsCad",
    })
    this.checkRejectedAndThrow(info)
  }
  private async sendEmailChange(payload: NotificationPayloads["emailChange"]) {}
  private async sendEmailChangeSuccess(payload: NotificationPayloads["emailChangeSuccess"]) {}
  async sendNotification<T extends NotificationType>(type: T, payload: NotificationPayloads[T]) {
    await this.handlers[type](payload)
  }
}

export default new EmailSender(mailer)
// EmailSender.send("send")
