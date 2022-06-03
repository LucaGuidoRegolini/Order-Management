import { inject, injectable } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { AppError } from '@shared/errors/AppError';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
export class DeleteUserAvatarService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 404);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    user.avatar = null;

    const newUser = await this.userRepository.save(user);

    return instanceToInstance(newUser);
  }
}
