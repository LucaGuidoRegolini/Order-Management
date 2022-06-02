import { password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { ChangePasswordService } from './ChangePasswordService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let changePasswordService: ChangePasswordService;

describe('ChangePasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    changePasswordService = new ChangePasswordService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to change the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = await changePasswordService.execute({
      old_password: '123456',
      new_password: '123123',
      user_id: user.id,
    });

    expect(resp.name).toBe('John Doe');
  });

  it('should not be able to change the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = changePasswordService.execute({
      old_password: '12345677',
      new_password: '123123',
      user_id: user.id,
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the password with wrong user id', async () => {
    const resp = changePasswordService.execute({
      old_password: '12345677',
      new_password: '123123',
      user_id: 'wrong_id',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the password with same password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const resp = changePasswordService.execute({
      old_password: '123456',
      new_password: '123456',
      user_id: user.id,
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
