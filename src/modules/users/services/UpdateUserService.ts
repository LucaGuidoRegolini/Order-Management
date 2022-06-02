import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

interface IRequest {
  user_id: string;
  name?: string;
  email?: string;
  pipedrive_token?: string;
}

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    pipedrive_token,
  }: IRequest): Promise<User> {
    const email_exists = email
      ? (await this.userRepository.findBy({
          email,
        })) !== undefined
      : false;

    if (email_exists) throw new AppError('Email já cadastrado', 401);

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 401);

    if (email) {
      user.email = email;
      user.email_active = false;
    }

    if (name) user.name = name;

    if (pipedrive_token) user.pipedrive_token = pipedrive_token;

    const newUser = await this.userRepository.save(user);

    return instanceToInstance(newUser);
  }
}
