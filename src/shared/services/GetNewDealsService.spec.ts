import { password_salt } from '@config/password';
import { FakeClientRepository } from '@modules/deals/repositories/fakes/FakeClientRepository';
import { FakeDealRepository } from '@modules/deals/repositories/fakes/FakeDealRepository';
import { FakeUserRepository } from '@modules/users/repositories/fakes/FakeUserRepository';
import { FakePipeDriveProvider } from '@shared/container/providers/PipedriveProvider/fakes/FakePipeDriveProvider';
import { hashSync } from 'bcrypt';
import { GetNewDealsService } from './GetNewDealsService';

let fakeUsersRepository: FakeUserRepository;
let fakeDealRepository: FakeDealRepository;
let fakeClientRepository: FakeClientRepository;
let fakePipedriveProvider: FakePipeDriveProvider;

let getNewDealsService: GetNewDealsService;

describe('GetNewDealsService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeClientRepository = new FakeClientRepository();
    fakeDealRepository = new FakeDealRepository();
    fakePipedriveProvider = new FakePipeDriveProvider();

    getNewDealsService = new GetNewDealsService(
      fakeDealRepository,
      fakeClientRepository,
      fakePipedriveProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to get new deals', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const getDeals = jest.spyOn(fakePipedriveProvider, 'getDeals');

    await getNewDealsService.execute({
      user_id: user.id,
    });

    expect(getDeals).toHaveBeenCalled();
  });
});
