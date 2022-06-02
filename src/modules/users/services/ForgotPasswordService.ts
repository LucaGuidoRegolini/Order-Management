import { v4 } from 'uuid';
import { inject, injectable } from 'tsyringe';
import path from 'path';

import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { password_forget } from '@config/password';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class ForgotPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.userRepository.findBy({ email });

    if (!user) throw new AppError('Usuário não encontrado');

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    const keysPassword = await this.redisProvider.keys(
      `${password_forget.prefix}${user.id}`,
    );

    await this.redisProvider.del(keysPassword);

    const token = `${user.id}${v4()}`;

    await this.redisProvider.set({
      key: `${password_forget.prefix}${token}`,
      value: user.id,
      time: password_forget.expiresIn,
      option: 'EX',
    });

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}
