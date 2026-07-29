import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client = new SESClient({ region: process.env.AWS_REGION });
  private readonly fromEmail = process.env.SES_FROM_EMAIL;

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    if (!this.fromEmail) {
      this.logger.warn(
        `SES_FROM_EMAIL not configured, skipping email to ${to}: "${subject}"`,
      );
      return;
    }

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: htmlBody } },
      },
    });

    try {
      await this.client.send(command);
      this.logger.log(`Email sent to ${to}: "${subject}"`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
      );
    }
  }
}
