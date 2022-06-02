import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteUserAvatarService } from '../services/DeleteUserAvatarService';
import { UpdateUserAvatarService } from '../services/UpdateUserAvatar';

export class AvatarController {
  async update(req: Request, res: Response): Promise<Response> {
    const { id: user_uuid } = req.user;

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      user_uuid,
      avatarFilename: req.file?.filename || undefined,
    });

    return res.json(user);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id: user_uuid } = req.user;

    const deleteUserAvatarService = container.resolve(DeleteUserAvatarService);

    const user = await deleteUserAvatarService.execute({
      user_uuid,
    });

    return res.json(user);
  }
}
