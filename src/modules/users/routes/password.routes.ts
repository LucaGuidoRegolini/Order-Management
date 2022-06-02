import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { PasswordController } from '../controller/PasswordController';

import {
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from './validation/password.validation';

const passwordRouter = Router();
const passwordController = new PasswordController();

passwordRouter.post(
  '/forgot',
  forgotPasswordValidation,
  passwordController.forgot,
);
passwordRouter.post(
  '/reset/:token',
  resetPasswordValidation,
  passwordController.reset,
);

passwordRouter.use(ensureAuthenticated);

passwordRouter.post(
  '/change/:user_uuid',
  changePasswordValidation,
  passwordController.change,
);

export { passwordRouter };
