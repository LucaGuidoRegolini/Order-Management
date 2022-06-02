import { password_salt } from '@config/password';
import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { DeleteUserAvatarService } from './DeleteUserAvatarService';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;

let deleteUserAvatarService: DeleteUserAvatarService;

describe('DeleteUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    deleteUserAvatarService = new DeleteUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to delete the avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.avatar = 'avatar.jpg';
    fakeUsersRepository.save(user);

    const deleteAvatar = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await deleteUserAvatarService.execute({
      user_uuid: user.id,
    });

    expect(deleteAvatar).toHaveBeenCalledWith('avatar.jpg');
  });

  it('should be able to delete the avatar with u no avatar user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    fakeUsersRepository.save(user);

    const deleteAvatar = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await deleteUserAvatarService.execute({
      user_uuid: user.id,
    });

    expect(deleteAvatar).not.toHaveBeenCalled();
  });

  it('should not be able to delete the avatar with wrong user id', async () => {
    const resp = deleteUserAvatarService.execute({
      user_uuid: 'user_id',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
