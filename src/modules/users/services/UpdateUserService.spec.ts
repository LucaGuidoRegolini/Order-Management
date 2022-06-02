import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { UpdateUserService } from './UpdateUserService';

let fakeUsersRepository: FakeUserRepository;

let updateUserService: UpdateUserService;

describe('UpdateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    updateUserService = new UpdateUserService(fakeUsersRepository);
  });

  it('should be able to update a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const newUser = await updateUserService.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john2@email.com',
      pipedrive_token: 'token2',
    });

    expect(newUser.name).toBe('John Trê');
    expect(newUser.email).toBe('john2@email.com');
  });

  it('should be able to update a user without updating email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const newUser = await updateUserService.execute({
      user_id: user.id,
      name: 'John Trê',
      pipedrive_token: 'token2',
    });

    expect(newUser.name).toBe('John Trê');
    expect(newUser.email).toBe('john@email.com');
  });

  it('should not be able to update a user with non-existing user', async () => {
    const resp = updateUserService.execute({
      user_id: 'non-existing-user',
      name: 'John Trê',
      email: 'john2@email.com',
      pipedrive_token: 'token2',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    await fakeUsersRepository.create({
      name: 'John Uno',
      email: 'john2@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = updateUserService.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john2@email.com',
      pipedrive_token: 'token2',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
