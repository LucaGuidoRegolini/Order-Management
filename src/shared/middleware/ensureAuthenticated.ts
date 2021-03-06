import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwt_config } from '@config/auth';
import { AppError } from '../errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  id: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT inexistente!', 404);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, jwt_config.secret as string);

    const { id } = decoded as ITokenPayload;

    request.user = {
      id,
    };

    return next();
  } catch (error) {
    throw new AppError('Token Inválido', 401);
  }
}

export { ensureAuthenticated };
