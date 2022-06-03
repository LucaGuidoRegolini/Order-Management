import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { UserController } from '../controller/UserController';
import { passwordRouter } from './password.routes';
import { sessionRoutes } from './session.routes';
import { emailRoutes } from './email.routes';
import { avatarRoutes } from './avatar.routes';

import {
  createUserValidation,
  updateUserValidation,
} from './validation/user.validation';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use('/sessions', sessionRoutes);
userRoutes.use('/password', passwordRouter);
userRoutes.use('/email', emailRoutes);
userRoutes.use('/avatar', avatarRoutes);

userRoutes.post('/', createUserValidation, userController.create);

userRoutes.use(ensureAuthenticated);

userRoutes.put('/', updateUserValidation, userController.updated);
userRoutes.get('/', userController.show);
userRoutes.delete('/', userController.softDelete);

export { userRoutes };
