import { userRoutes } from '@modules/users/routes/user.routes';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (request: Request, response: Response) =>
  response.send('Order Management - 0.0.1'),
);

router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.route)
    return response.status(404).send(`${request.url} não encontrado`);
  return next();
});

export { router };
