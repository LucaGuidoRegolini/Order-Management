import { password_forget, password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { ResetPasswordService } from './ResetPasswordService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to reset a password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const token = v4();
    await fakeRedisProvider.set({
      key: `${password_forget.prefix}${token}`,
      value: user.id,
    });

    const saveUser = jest.spyOn(fakeUsersRepository, 'save');

    await resetPasswordService.execute({
      token,
      new_password: '123123',
    });

    expect(saveUser).toHaveBeenCalledWith(user);
  });

  it('should not be able to reset a password with non-existing token', async () => {
    const resp = resetPasswordService.execute({
      token: 'non-existing-token',
      new_password: '123123',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password with non-existing user', async () => {
    const token = v4();
    await fakeRedisProvider.set({
      key: `${password_forget.prefix}${token}`,
      value: 'non-existing-user',
    });

    const resp = resetPasswordService.execute({
      token,
      new_password: '123123',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
