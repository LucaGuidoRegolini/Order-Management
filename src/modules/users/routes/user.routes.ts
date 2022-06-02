import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { UserController } from '../controller/UserController';
import { passwordRouter } from './password.routes';
import { sessionRoutes } from './session.routes';
import { emailRoutes } from './email.routes';
import { avatarRoutes } from './avatar.routes';

import {
  createEmployeeValidation,
  updateUserValidation,
  showUserValidation,
} from './validation/user.validation';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use('/sessions', sessionRoutes);
userRoutes.use('/password', passwordRouter);
userRoutes.use('/email', emailRoutes);
userRoutes.use('/avatar', avatarRoutes);

userRoutes.use(ensureAuthenticated);

userRoutes.post('/:token', createEmployeeValidation, userController.create);
userRoutes.put('/:user_uuid', updateUserValidation, userController.updated);
userRoutes.get('/:user_uuid', showUserValidation, userController.show);

export { userRoutes };
