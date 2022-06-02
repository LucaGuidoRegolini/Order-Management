import { inject, injectable } from 'tsyringe';

import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { refreshToken_config } from '@config/auth';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class DeleteSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute(
    refresh_token: string,
    request_id: string,
  ): Promise<void> {
    const user_id = await this.redisProvider.get(
      `${refreshToken_config.prefix}${refresh_token}`,
    );

    if (!user_id) throw new AppError('Token inválido');

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado');

    if (user.id !== request_id) throw new AppError('Usuário não autorizado');

    await this.redisProvider.del(
      `${refreshToken_config.prefix}${refresh_token}`,
    );
  }
}
