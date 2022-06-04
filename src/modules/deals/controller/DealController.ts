import { GetNewDealsService } from '@shared/services/GetNewDealsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListDealsService } from '../services/ListDealsService';

export class DealController {
  async list(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10, initial_date, final_date } = req.query;
    const { id: user_id } = req.user;

    const getNewDealsService = container.resolve(GetNewDealsService);

    await getNewDealsService.execute({
      user_id,
    });

    const listDealsService = container.resolve(ListDealsService);

    const deals = await listDealsService.execute({
      page: page as number | undefined,
      limit: limit as number | undefined,
      user_id,
      initial_date: initial_date as Date | undefined,
      final_date: final_date as Date | undefined,
    });

    return res.json(deals);
  }
}
