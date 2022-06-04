import { password_salt } from '@config/password';

import { FakeUserRepository } from '@modules/users/repositories/fakes/FakeUserRepository';
import { hashSync } from 'bcrypt';
import { DeleteUserDeletedService } from './DeleteUserDeletedService';

let fakeUsersRepository: FakeUserRepository;

let deleteUserDeletedService: DeleteUserDeletedService;

describe('DeleteUserDeletedService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    deleteUserDeletedService = new DeleteUserDeletedService(
      fakeUsersRepository,
    );
  });

  it('should be able to delete user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.deleted_at = new Date('1920-01-01');
    user.is_deleted = true;

    await fakeUsersRepository.save(user);

    const deleteUser = jest.spyOn(fakeUsersRepository, 'delete');

    await deleteUserDeletedService.execute();

    expect(deleteUser).toHaveBeenCalled();
  });
});
