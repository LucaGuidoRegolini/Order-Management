import { password_salt } from '@config/password';
import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { AppError } from '@shared/errors/AppError';
import { hashSync } from 'bcrypt';
import { FakeUserRepository } from '../repositories/fakes/FakeUserRepository';
import { UpdateUserAvatarService } from './UpdateUserAvatar';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update the avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    const updateAvatar = jest.spyOn(fakeStorageProvider, 'saveFile');

    const resp = await updateUserAvatarService.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    expect(updateAvatar).toHaveBeenCalled();
    expect(resp.avatar).toBe('avatar.jpg');
  });

  it('should be able to update the avatar with a user who has avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: hashSync('123456', password_salt),
      pipedrive_token: 'token',
    });

    user.avatar = 'avatar.jpg';
    await fakeUsersRepository.save(user);

    const updateAvatar = jest.spyOn(fakeStorageProvider, 'saveFile');

    const resp = await updateUserAvatarService.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    expect(updateAvatar).toHaveBeenCalled();
    expect(resp.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update the avatar with non-existing user', async () => {
    const resp = updateUserAvatarService.execute({
      avatarFilename: 'avatar.jpg',
      user_id: 'non-existing-user',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the avatar with non-existing avatar', async () => {
    const resp = updateUserAvatarService.execute({
      user_id: 'non-existing-user',
    });

    await expect(resp).rejects.toBeInstanceOf(AppError);
  });
});
