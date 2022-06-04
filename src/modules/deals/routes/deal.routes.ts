import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { DealController } from '../controller/DealController';

const dealRoutes = Router();
const dealController = new DealController();

dealRoutes.use(ensureAuthenticated);

dealRoutes.get('/', dealController.list);

export { dealRoutes };
