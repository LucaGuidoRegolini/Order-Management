import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '@modules/users/interfaces/IUserRepository';
import { AppError } from '@shared/errors/AppError';

import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IDealRepository } from '../interfaces/IDealRepository';
import { Deal } from '../entities/Deal';

interface IRequest {
  initial_date?: Date;
  final_date?: Date;
  page?: number;
  limit?: number;
  user_id: string;
}

@injectable()
export class ListDealsService {
  constructor(
    @inject('DealRepository')
    private dealsRepository: IDealRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    initial_date,
    final_date,
    page,
    limit,
    user_id,
  }: IRequest): Promise<IPaginatedResponse<Deal>> {
    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado');

    const deals = await this.dealsRepository.listBy({
      filters: {
        user_id,
      },
      page,
      limit,
      initial_date,
      final_date,
    });

    return deals;
  }
}
