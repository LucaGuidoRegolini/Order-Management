import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

interface IRequest {
  user_id: string;
  avatarFilename?: string;
}

@injectable()
export class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    if (!avatarFilename) throw new AppError('Não foi enviado um avatar');

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 404);

    const filename = await this.storageProvider.saveFile(avatarFilename);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    user.avatar = filename;

    const newUser = await this.userRepository.save(user);

    return instanceToInstance(newUser);
  }
}
