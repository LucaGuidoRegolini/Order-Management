import { v4 } from 'uuid';

import { ICreateDealDTO } from '@modules/deals/dtos/ICreateDealDTO';
import { IListDealDTO } from '@modules/deals/dtos/IListDealDTO';
import { Deal } from '@modules/deals/entities/Deal';
import { IDealRepository } from '@modules/deals/interfaces/IDealRepository';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';

export class FakeDealRepository implements IDealRepository {
  private deals: Deal[] = [];

  public async findBy(filters: Partial<Deal>): Promise<Deal | undefined> {
    const deal = this.deals.find(findDeal => {
      return Object.keys(filters).every(key => {
        return findDeal[key] === filters[key];
      });
    });

    return deal;
  }

  public async listBy({
    filters,
    page = 1,
    limit = 10,
    initial_date,
    final_date,
  }: IListDealDTO): Promise<IPaginatedResponse<Deal>> {
    const deals = this.deals.filter(findDeal => {
      let validDeal: boolean;
      validDeal = filters
        ? Object.keys(filters).every(key => findDeal[key] === filters[key])
        : true;

      if (initial_date && final_date) {
        validDeal =
          validDeal &&
          findDeal.deal_date >= initial_date &&
          findDeal.deal_date <= final_date;
      }

      return validDeal;
    });

    const dealTotal = deals.length;

    const paginatedDeals = deals.slice((page - 1) * limit);

    return {
      results: paginatedDeals,
      total: dealTotal,
      page,
      limit,
    };
  }

  public async index(filters: Partial<Deal>): Promise<Deal[]> {
    const deals = this.deals.filter(findDeal => {
      return Object.keys(filters).every(key => findDeal[key] === filters[key]);
    });

    return deals;
  }

  public async create(data: ICreateDealDTO): Promise<Deal> {
    const deal = new Deal();

    Object.assign(deal, {
      id: v4(),
      pipedrive_id: data.pipedrive_id,
      title: data.title,
      value: data.value,
      product_count: data.product_count,
      client_id: data.client_id,
      user_id: data.user_id,
      user_pipedrive_id: data.user_pipedrive_id,
      deal_date: data.deal_date,
    });

    this.deals.push(deal);

    return deal;
  }

  public async save(deal: Deal): Promise<Deal> {
    const findIndex = this.deals.findIndex(findDeal => findDeal.id === deal.id);

    this.deals[findIndex] = deal;

    return deal;
  }

  public async delete(deal: Deal): Promise<void> {
    const findIndex = this.deals.findIndex(findDeal => findDeal.id === deal.id);

    this.deals.splice(findIndex, 1);
  }
}
