import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { SoftDeleteUserService } from './SoftDeleteUserService';

let fakeUsersRepository: FakeUserRepository;

let softDeleteUserService: SoftDeleteUserService;

describe('SoftDeleteUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    softDeleteUserService = new SoftDeleteUserService(fakeUsersRepository);
  });

  it('should be able to soft delete a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const saveAvatar = jest.spyOn(fakeUsersRepository, 'save');

    await softDeleteUserService.execute({
      user_id: user.id,
    });

    expect(saveAvatar).toHaveBeenCalled();
  });

  it('should not be able to soft delete a user with non-existing user', async () => {
    const resp = softDeleteUserService.execute({
      user_id: 'non-existing-user',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
