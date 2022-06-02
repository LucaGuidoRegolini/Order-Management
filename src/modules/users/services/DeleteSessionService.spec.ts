import { refreshToken_config } from '@config/auth';
import { password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { DeleteSessionService } from './DeleteSessionService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let deleteSessionService: DeleteSessionService;

describe('DeleteSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    deleteSessionService = new DeleteSessionService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to delete the session', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const token = v4();
    fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${token}`,
      value: user.id,
    });

    const deleteSession = jest.spyOn(fakeRedisProvider, 'del');

    await deleteSessionService.execute(token, user.id);

    expect(deleteSession).toHaveBeenCalledWith(
      `${refreshToken_config.prefix}${token}`,
    );
  });

  it('should not be able to delete the session with wrong token', async () => {
    const resp = deleteSessionService.execute('token', 'user_id');

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete the session with wrong user id', async () => {
    const token = v4();
    fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${token}`,
      value: 'user_id',
    });

    const resp = deleteSessionService.execute(token, 'user_id');

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete the session with wrong user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const token = v4();
    fakeRedisProvider.set({
      key: `${refreshToken_config.prefix}${token}`,
      value: user.id,
    });

    const resp = deleteSessionService.execute(token, 'user_id');

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
