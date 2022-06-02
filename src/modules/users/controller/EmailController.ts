import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendEmailConfirmationService } from '../services/SendEmailConfirmationService';
import { VerifyEmailService } from '../services/VerifyEmailService';

export class EmailController {
  async send(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendEmailConfirmationService = container.resolve(
      SendEmailConfirmationService,
    );

    await sendEmailConfirmationService.execute({ email });

    return res.status(204).json();
  }

  async verify(req: Request, res: Response): Promise<Response> {
    const { token } = req.params;

    const verifyEmailService = container.resolve(VerifyEmailService);

    await verifyEmailService.execute({ token });

    return res.status(204).json();
  }
}
