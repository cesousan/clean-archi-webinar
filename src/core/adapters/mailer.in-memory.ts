import { Email, IEmailer } from '../ports/mailer.interface';

export class InMemoryMailer implements IEmailer {
  public readonly sentEmails: Email[] = [];
  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}
