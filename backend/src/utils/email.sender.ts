type NotificationPayloads = {
  emailConfirm: { target: string; userName: string; code: number }
  emailChange: NotificationPayloads["emailConfirm"] & { preventLink: string; oldEmail: string }
  emailChangeSuccess: { target: string; userName: string }
}

type NotificationType = keyof NotificationPayloads

class EmailSender {
  constructor() {}
  private handlers: {
    [K in NotificationType]: (payload: NotificationPayloads[K]) => Promise<void>
  } = {
    emailConfirm: this.sendEmailConfirm.bind(this),
    emailChange: this.sendEmailChange.bind(this),
    emailChangeSuccess: this.sendEmailChangeSuccess.bind(this),
  }
  private async sendEmailConfirm(payload: NotificationPayloads["emailConfirm"]) {}
  private async sendEmailChange(payload: NotificationPayloads["emailChange"]) {}
  private async sendEmailChangeSuccess(payload: NotificationPayloads["emailChangeSuccess"]) {}
  async sendNotification<T extends NotificationType>(type: T, payload: NotificationPayloads[T]) {
    try {
      await this.handlers[type](payload)
    } catch (error) {}
  }
}

export default new EmailSender()
// EmailSender.send("send")
