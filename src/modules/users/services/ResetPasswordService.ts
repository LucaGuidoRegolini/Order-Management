import { inject, injectable } from 'tsyringe';
import { hashSync } from 'bcrypt';

import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { password_forget, password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { refreshToken_config } from '@config/auth';
import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  token: string;
  new_password: string;
}

@injectable()
export class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute({ token, new_password }: IRequest): Promise<void> {
    const user_id = await this.redisProvider.get(
      `${password_forget.prefix}${token}`,
    );

    if (!user_id) throw new AppError('Token inválido');

    await this.redisProvider.del(`${password_forget.prefix}${token}`);

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado');

    const userSessions = await this.redisProvider.keys(
      `${refreshToken_config.prefix}${user.id}`,
    );

    await this.redisProvider.del(userSessions);

    const passwordHash = hashSync(new_password, password_salt);

    user.password = passwordHash;

    await this.userRepository.save(user);
  }
}
