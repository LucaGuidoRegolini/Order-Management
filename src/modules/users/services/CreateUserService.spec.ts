import { password_salt } from '@config/password';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { CreateUserService } from './CreateUserService';

let fakeUsersRepository: FakeUserRepository;

let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    createUserService = new CreateUserService(fakeUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const resp = await createUserService.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
      token: 'token',
    });

    expect(resp.name).toBe('John Doe');
  });

  it('should not be able to create a new user with same email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = createUserService.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
      token: 'token',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
