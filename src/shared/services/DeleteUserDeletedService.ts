import { inject, injectable } from 'tsyringe';
import { add } from 'date-fns';

import { IUserRepository } from '@modules/users/interfaces/IUserRepository';

@injectable()
export class DeleteUserDeletedService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(): Promise<void> {
    const users = await this.userRepository.index();

    Promise.all(
      users.map(async user => {
        if (user.is_deleted && user.deleted_at) {
          if (user.deleted_at <= add(new Date(), { months: 1 })) {
            await this.userRepository.delete(user);
          }
        }
      }),
    );
  }
}
