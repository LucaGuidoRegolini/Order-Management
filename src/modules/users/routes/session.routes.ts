import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { SessionController } from '../controller/SessionController';

import {
  createSessionValidation,
  deleteSessionValidation,
  refreshSessionValidation,
} from './validation/session.validation';

const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post('/', createSessionValidation, sessionController.create);
sessionRoutes.put('/', refreshSessionValidation, sessionController.refresh);

sessionRoutes.use(ensureAuthenticated);

sessionRoutes.delete('/', deleteSessionValidation, sessionController.destroy);

export { sessionRoutes };
