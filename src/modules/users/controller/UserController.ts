import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '../services/CreateUserService';
import { ShowUserService } from '../services/ShowUserService';
import { SoftDeleteUserService } from '../services/SoftDeleteUserService';
import { UpdateUserService } from '../services/UpdateUserService';

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, token } = req.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      password,
      token,
    });

    return res.json(user);
  }

  async updated(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { name, email, token } = req.body;

    const updatedUserService = container.resolve(UpdateUserService);

    const user = await updatedUserService.execute({
      user_id,
      name: name || undefined,
      email: email || undefined,
      pipedrive_token: token || undefined,
    });

    return res.json(user);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute({
      user_id,
    });

    return res.json(user);
  }

  async softDelete(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const softDeleteUserService = container.resolve(SoftDeleteUserService);

    await softDeleteUserService.execute({
      user_id,
    });

    return res.status(204).send();
  }
}
