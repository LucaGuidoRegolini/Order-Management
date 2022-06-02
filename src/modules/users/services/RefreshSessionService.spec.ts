import { refreshToken_config } from '@config/auth';
import { password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { RefreshSessionService } from './RefreshSessionService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let refreshSessionService: RefreshSessionService;

describe('RefreshSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    refreshSessionService = new RefreshSessionService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to refresh a session', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const refreshToken = v4();
    await fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${refreshToken}`,
      value: user.id,
    });

    const resp = await refreshSessionService.execute(refreshToken);

    expect(resp).toHaveProperty('user');
    expect(resp).toHaveProperty('access_token');
    expect(resp).toHaveProperty('refresh_token');
  });

  it('should not be able to refresh a session with non-existing refresh token', async () => {
    const resp = refreshSessionService.execute('non-existing-token');

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh a session with non-existing user', async () => {
    const refreshToken = v4();
    await fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${refreshToken}`,
      value: 'non-existing-user',
    });

    const resp = refreshSessionService.execute(refreshToken);

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh a session with a no confirmed user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.email_active = false;
    fakeUsersRepository.save(user);

    const refreshToken = v4();
    await fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${refreshToken}`,
      value: user.id,
    });

    const resp = refreshSessionService.execute(refreshToken);

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
