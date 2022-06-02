import { v4 } from 'uuid';
import { inject, injectable } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { refreshToken_config } from '@config/auth';
import { jwtGenerate } from '@shared/util/jwtGenerate';
import { ILoginResponse } from '@shared/interfaces/ILoginResponse';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class RefreshSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute(refresh_token: string): Promise<ILoginResponse> {
    const user_id = await this.redisProvider.get(
      `${refreshToken_config.prefix}${refresh_token}`,
    );

    if (!user_id) throw new AppError('Token inválido');

    await this.redisProvider.del(
      `${refreshToken_config.prefix}${refresh_token}`,
    );

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado');

    if (!user.email_active) throw new AppError('E-mail não confirmado', 401);

    const jwToken = jwtGenerate(user.id);

    const refreshToken = v4();

    await this.redisProvider.set({
      key: `${refreshToken_config.prefix}${refreshToken}`,
      value: user.id,
      time: refreshToken_config.expiresIn,
      option: 'EX',
    });

    return {
      user: instanceToInstance(user),
      access_token: jwToken,
      refresh_token: refreshToken,
    };
  }
}
