import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';

import { userRoutes } from '@modules/users/routes/user.routes';
import { dealRoutes } from '@modules/deals/routes/deal.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/deals', dealRoutes);

router.get('/', (request: Request, response: Response) =>
  response.sendFile(path.resolve(__dirname, '../views/home_page.html')),
);

router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.route)
    return response.status(404).send(`${request.url} não encontrado`);
  return next();
});

export { router };
