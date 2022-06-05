import { AppError } from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { User } from '../entities/User';

import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export class RestoreUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findBy(
      {
        id: user_id,
      },
      true,
    );

    if (!user) throw new AppError('Usuário sem permissão', 401);

    if (user.is_deleted === false) throw new AppError('Não foi excluído', 401);

    user.is_deleted = false;
    user.deleted_at = null;
    const newUser = await this.userRepository.save(user);

    return instanceToInstance(newUser);
  }
}
