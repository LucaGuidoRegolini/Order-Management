import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ChangePasswordService } from '../services/ChangePasswordService';
import { ForgotPasswordService } from '../services/ForgotPasswordService';
import { ResetPasswordService } from '../services/ResetPasswordService';

export class PasswordController {
  async forgot(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const forgotPasswordService = container.resolve(ForgotPasswordService);

    await forgotPasswordService.execute(email);

    return res.status(204).json();
  }

  async reset(req: Request, res: Response): Promise<Response> {
    const { token } = req.params;
    const { new_password } = req.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({
      token,
      new_password,
    });

    return res.status(204).json();
  }

  async change(req: Request, res: Response): Promise<Response> {
    const { new_password, old_password } = req.body;
    const { id: user_id } = req.user;

    const changePasswordService = container.resolve(ChangePasswordService);

    const user = await changePasswordService.execute({
      new_password,
      old_password,
      user_id,
    });

    return res.json(user);
  }
}
