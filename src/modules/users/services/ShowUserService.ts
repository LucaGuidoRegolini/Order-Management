import { inject, injectable } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { AppError } from '@shared/errors/AppError';
import { User } from '../entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export class ShowUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 401);

    return instanceToInstance(user);
  }
}
