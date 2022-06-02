import { password_salt } from '@config/password';
import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { FakeRedisProvider } from '@shared/container/providers/RedisProvider/fakes/FakeRedisProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { SendEmailConfirmationService } from './SendEmailConfirmationService';

let fakeUsersRepository: FakeUserRepository;
let fakeRedisProvider: FakeRedisProvider;
let fakeMailProvider: FakeMailProvider;

let sendEmailConfirmationService: SendEmailConfirmationService;

describe('SendEmailConfirmationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeRedisProvider = new FakeRedisProvider();
    fakeMailProvider = new FakeMailProvider();

    sendEmailConfirmationService = new SendEmailConfirmationService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeRedisProvider,
    );
  });

  it('should be able to send email confirmation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendEmailConfirmationService.execute({
      email: user.email,
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to send email confirmation with non-existing user', async () => {
    const resp = sendEmailConfirmationService.execute({
      email: 'john@email.com',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
