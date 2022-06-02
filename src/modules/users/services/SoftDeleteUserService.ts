import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '../interfaces/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export class SoftDeleteUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<void> {
    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário sem permissão', 401);

    user.is_deleted = true;
    user.deleted_at = new Date();

    await this.userRepository.save(user);
  }
}
