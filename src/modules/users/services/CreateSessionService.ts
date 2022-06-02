import { v4 } from 'uuid';
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import { instanceToInstance } from 'class-transformer';

import { AppError } from '@shared/errors/AppError';
import { refreshToken_config } from '@config/auth';
import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { jwtGenerate } from '@shared/util/jwtGenerate';
import { ILoginResponse } from '@shared/interfaces/ILoginResponse';
import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  email: string;
  password: string;
  remember_me: boolean;
}

@injectable()
export class CreateSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute({
    email,
    password,
    remember_me,
  }: IRequest): Promise<ILoginResponse> {
    const user = await this.userRepository.findBy({
      email,
    });

    if (!user) throw new AppError('email ou senha inválidos');

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) throw new AppError('email ou senha inválidos', 401);

    if (!user.email_active) throw new AppError('E-mail não confirmado', 401);

    const jwToken = jwtGenerate(user.id);

    const refreshToken = remember_me ? `${user.id}${v4()}` : undefined;

    if (refreshToken) {
      const userSessions = await this.redisProvider.keys(
        `${refreshToken_config.prefix}${user.id}`,
      );

      if (userSessions.length >= refreshToken_config.max_sessions) {
        await this.redisProvider.del(userSessions[0]);
      }

      await this.redisProvider.set({
        key: `${refreshToken_config.prefix}${refreshToken}`,
        value: user.id,
        time: refreshToken_config.expiresIn,
        option: 'EX',
      });
    }

    return {
      user: instanceToInstance(user),
      access_token: jwToken,
      refresh_token: refreshToken,
    };
  }
}
