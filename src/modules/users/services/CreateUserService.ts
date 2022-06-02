import { inject, injectable } from 'tsyringe';
import { hashSync } from 'bcrypt';

import { instanceToInstance } from 'class-transformer';
import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
  token: string;
}

@injectable()
export class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
    token,
  }: IRequest): Promise<User> {
    const email_exists = await this.userRepository.findBy({
      email,
    });

    if (email_exists) throw new AppError('Email já cadastrado', 401);

    const passwordHash = hashSync(password, password_salt);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      pipedrive_token: token,
    });

    return instanceToInstance(user);
  }
}
