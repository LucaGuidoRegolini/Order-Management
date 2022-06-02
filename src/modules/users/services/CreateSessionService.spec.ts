import { password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { CreateSessionService } from './CreateSessionService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let createSessionService: CreateSessionService;

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to create a new session without redis', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const {
      user: sessionUser,
      access_token,
      refresh_token,
    } = await createSessionService.execute({
      email: 'john@email.com',
      password: '123456',
      remember_me: false,
    });

    expect(sessionUser.email).toEqual(user.email);
    expect(access_token).toBeTruthy();
    expect(refresh_token).toBeFalsy();
  });

  it('should be able to create a new session with redis', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const {
      user: sessionUser,
      access_token,
      refresh_token,
    } = await createSessionService.execute({
      email: 'john@email.com',
      password: '123456',
      remember_me: true,
    });

    expect(sessionUser.email).toEqual(user.email);
    expect(access_token).toBeTruthy();
    expect(refresh_token).toBeTruthy();
  });

  it('should not be able to create a new session with non existing user', async () => {
    const response = createSessionService.execute({
      email: 'john@email.com',
      password: '123456',
      remember_me: true,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const response = createSessionService.execute({
      email: 'john@email.com',
      password: '12345677',
      remember_me: false,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session with email not active', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.email_active = false;

    fakeUsersRepository.save(user);

    const resp = createSessionService.execute({
      email: 'john@email.com',
      password: '123456',
      remember_me: false,
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
