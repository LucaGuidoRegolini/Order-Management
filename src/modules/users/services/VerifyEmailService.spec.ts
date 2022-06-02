import { validation_email_config } from '@config/mail';
import { password_salt } from '@config/password';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { VerifyEmailService } from './VerifyEmailService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;

let verifyEmailService: VerifyEmailService;

describe('VerifyEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();

    verifyEmailService = new VerifyEmailService(
      fakeUsersRepository,
      fakeRedisProvider,
    );
  });

  it('should be able to verify email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const token = v4();
    await fakeRedisProvider.set({
      key: `${validation_email_config.prefix}${token}`,
      value: user.id,
    });

    const saveUser = jest.spyOn(fakeUsersRepository, 'save');

    await verifyEmailService.execute({
      token,
    });

    expect(saveUser).toHaveBeenCalledWith(user);
  });

  it('should not be able to verify email with non-existing user', async () => {
    const token = v4();
    await fakeRedisProvider.set({
      key: `${validation_email_config.prefix}${token}`,
      value: 'non-existing-user-id',
    });

    const resp = verifyEmailService.execute({
      token,
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to verify email with non-existing token', async () => {
    const resp = verifyEmailService.execute({
      token: 'non-existing-token',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
