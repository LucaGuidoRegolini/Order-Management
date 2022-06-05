import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { RestoreUserService } from './RestoreUserService';

let fakeUsersRepository: FakeUserRepository;

let restoreUserService: RestoreUserService;

describe('RestoreUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    restoreUserService = new RestoreUserService(fakeUsersRepository);
  });

  it('should be able to restore a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.is_deleted = true;
    user.deleted_at = new Date();

    fakeUsersRepository.save(user);

    const resp = await restoreUserService.execute({
      user_id: user.id,
    });

    expect(resp.id).toEqual(user.id);
  });

  it('should not be able to restore a user with non-existing user', async () => {
    const resp = restoreUserService.execute({
      user_id: 'non-existing-user',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to restore a user with already restored user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = restoreUserService.execute({
      user_id: user.id,
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
