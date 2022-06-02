import { password_salt } from '@config/password';
import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { ForgotPasswordService } from './ForgotPasswordService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;
let fakeMailProvider: FakeMailProvider;

let forgotPasswordService: ForgotPasswordService;

describe('ForgotPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();
    fakeMailProvider = new FakeMailProvider();

    forgotPasswordService = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeRedisProvider,
    );
  });

  it('should be able to create a new token', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await forgotPasswordService.execute('john@email.com');

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const rep = forgotPasswordService.execute('john@email.com');

    await expect(rep).rejects.toBeInstanceOf(AppError);
  });
});
