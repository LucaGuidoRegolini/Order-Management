import { inject, injectable } from 'tsyringe';

import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { validation_email_config } from '@config/mail';
import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  token: string;
}

@injectable()
export class VerifyEmailService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute({ token }: IRequest): Promise<void> {
    const user_id = await this.redisProvider.get(
      `${validation_email_config.prefix}${token}`,
    );

    if (!user_id) throw new AppError('Token inválido', 401);

    await this.redisProvider.del(`${validation_email_config.prefix}${token}`);

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 401);

    user.email_active = true;

    this.userRepository.save(user);
  }
}
