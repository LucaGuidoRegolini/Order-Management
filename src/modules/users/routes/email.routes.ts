import { Router } from 'express';

import { EmailController } from '../controller/EmailController';
import {
  sendEmailValidation,
  verifyEmailValidation,
} from './validation/email.validation';

const emailRoutes = Router();
const emailController = new EmailController();

emailRoutes.post('/', sendEmailValidation, emailController.send);
emailRoutes.post('/:token', verifyEmailValidation, emailController.verify);

export { emailRoutes };
