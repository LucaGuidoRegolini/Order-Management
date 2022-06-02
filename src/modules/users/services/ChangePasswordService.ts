import { inject, injectable } from 'tsyringe';
import { compare, hashSync } from 'bcrypt';
import { instanceToInstance } from 'class-transformer';

import { password_salt } from '@config/password';
import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { refreshToken_config } from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

interface IRequest {
  new_password: string;
  old_password: string;
  user_id: string;
}

@injectable()
export class ChangePasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute({
    old_password,
    new_password,
    user_id,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado');

    const passwordMatched = await compare(old_password, user.password);

    if (!passwordMatched) throw new AppError('Senha antiga incorreta');

    if (new_password === old_password)
      throw new AppError('Nova senha não pode ser igual a antiga');

    const userSessions = await this.redisProvider.keys(
      `${refreshToken_config.prefix}${user.id}`,
    );

    await this.redisProvider.del(userSessions);

    const passwordHash = hashSync(new_password, password_salt);

    user.password = passwordHash;

    await this.userRepository.save(user);

    return instanceToInstance(user);
  }
}
