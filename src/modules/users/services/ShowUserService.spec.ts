import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { ShowUserService } from './ShowUserService';

let fakeUsersRepository: FakeUserRepository;

let showUserService: ShowUserService;

describe('ShowUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    showUserService = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to show a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = await showUserService.execute({
      user_id: user.id,
    });

    expect(resp.name).toBe('John Doe');
    expect(resp.email).toBe('john@email.com');
  });

  it('should not be able to show a user with non-existing user', async () => {
    const resp = showUserService.execute({
      user_id: 'non-existing-user',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
