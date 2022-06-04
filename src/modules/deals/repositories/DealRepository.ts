import { getRepository, Repository } from 'typeorm';

import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { Deal } from '../entities/Deal';
import { ICreateDealDTO } from '../dtos/ICreateDealDTO';
import { IDealRepository } from '../interfaces/IDealRepository';
import { IListDealDTO } from '../dtos/IListDealDTO';

export class DealRepository implements IDealRepository {
  private ormRepository: Repository<Deal>;

  constructor() {
    this.ormRepository = getRepository(Deal);
  }

  public async findBy(filters: Partial<Deal>): Promise<Deal | undefined> {
    const deal = await this.ormRepository.findOne({ where: filters });

    return deal;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    initial_date,
    final_date,
  }: IListDealDTO): Promise<IPaginatedResponse<Deal>> {
    const query = this.ormRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.client', 'client')
      .leftJoinAndSelect('client.email', 'email');

    if (filters) query.where(filters);

    if (initial_date && final_date) {
      query.andWhere('(deal.deal_date BETWEEN :initial_date AND :final_date)', {
        initial_date,
        final_date,
      });
    }

    const queryTotal = query.clone();

    query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const deals = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const dealTotal = await queryTotal.getCount();

    return {
      results: deals,
      total: dealTotal,
      page,
      limit,
    };
  }

  public async index(filters: Partial<Deal>): Promise<Deal[]> {
    return this.ormRepository.find({ where: filters });
  }

  public async create({
    title,
    value,
    pipedrive_id,
    product_count,
    client_id,
    user_id,
    user_pipedrive_id,
    deal_date,
  }: ICreateDealDTO): Promise<Deal> {
    const deal = this.ormRepository.create({
      title,
      value,
      pipedrive_id,
      product_count,
      client_id,
      user_id,
      user_pipedrive_id,
      deal_date,
    });

    await this.ormRepository.save(deal);

    return deal;
  }

  public async save(deal: Deal): Promise<Deal> {
    return this.ormRepository.save(deal);
  }

  public async delete(deal: Deal): Promise<void> {
    await this.ormRepository.remove(deal);
  }
}
