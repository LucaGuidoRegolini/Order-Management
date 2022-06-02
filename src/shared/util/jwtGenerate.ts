import { jwt_config } from '@config/auth';
import { sign } from 'jsonwebtoken';

export const jwtGenerate = (id: string): string => {
  return sign({ id }, jwt_config.secret, {
    expiresIn: jwt_config.expiresIn,
  });
};
