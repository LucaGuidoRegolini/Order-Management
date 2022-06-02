import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSessionService } from '../services/CreateSessionService';
import { DeleteSessionService } from '../services/DeleteSessionService';
import { RefreshSessionService } from '../services/RefreshSessionService';

export class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password, remember_me } = request.body;

    const createSessionService = container.resolve(CreateSessionService);

    const { user, access_token, refresh_token } =
      await createSessionService.execute({
        email,
        password,
        remember_me,
      });

    return response.json({ user, access_token, refresh_token });
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { refresh_token } = request.body;

    const refreshSessionService = container.resolve(RefreshSessionService);

    const resp = await refreshSessionService.execute(refresh_token);

    return response.json(resp);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id: user_id } = request.user;
    const { refresh_token } = request.body;

    const deleteSessionService = container.resolve(DeleteSessionService);

    await deleteSessionService.execute(refresh_token, user_id);

    return response.status(204).json();
  }
}
