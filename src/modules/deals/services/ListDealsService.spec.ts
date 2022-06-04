import { password_salt } from '@config/password';

import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '@modules/users/repositories/fakes/FakeUserRepository';
import { FakeDealRepository } from '../repositories/fakes/FakeDealRepository';

import { ListDealsService } from './ListDealsService';

let fakeUsersRepository: FakeUserRepository;
let fakeDealRepository: FakeDealRepository;

let listDealsService: ListDealsService;

describe('ListDealsService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeDealRepository = new FakeDealRepository();

    listDealsService = new ListDealsService(
      fakeDealRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list all deals', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const deal = await fakeDealRepository.create({
      user_id: user.id,
      pipedrive_id: 123,
      title: 'Deal 1',
      value: 100,
      product_count: 1,
      client_id: '123',
      user_pipedrive_id: 123,
      deal_date: new Date(),
    });

    const resp = await listDealsService.execute({
      user_id: user.id,
      initial_date: new Date('01/01/1920'),
      final_date: new Date('01/01/2120'),
    });

    expect(resp.results).toEqual([deal]);
  });

  it('should not be able to list all deals with wrong user id', async () => {
    const resp = listDealsService.execute({
      user_id: 'wrong_id',
      initial_date: new Date('01/01/1920'),
      final_date: new Date('01/01/2120'),
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
