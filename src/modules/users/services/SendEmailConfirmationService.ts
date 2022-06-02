import { v4 } from 'uuid';
import { inject, injectable } from 'tsyringe';
import path from 'path';

import { IRedisProvider } from '@shared/container/providers/RedisProvider/model/IRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { validation_email_config } from '@config/mail';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  email: string;
}

@injectable()
export class SendEmailConfirmationService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('RedisProvider')
    private redisProvider: IRedisProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findBy({
      email,
    });

    if (!user) throw new AppError('Usuário não encontrado', 401);

    const keysEmail = await this.redisProvider.keys(
      `${validation_email_config.prefix}${user.id}`,
    );
    await this.redisProvider.del(keysEmail);

    const token = `${user.id}${v4()}`;

    await this.redisProvider.set({
      key: `${validation_email_config.prefix}${token}`,
      value: user.id,
      time: validation_email_config.expiresIn,
      option: 'EX',
    });

    const confirmationEmailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'confirmation_email.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Confirmação de E-mail',
      templateData: {
        file: confirmationEmailTemplate,
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}
