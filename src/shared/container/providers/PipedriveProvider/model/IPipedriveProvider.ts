import { IDealDTO } from '../dtos/IDealDTO';

export interface IPipedriveProvider {
  getDeals(statusDeal: string, api_token: string): Promise<IDealDTO[]>;
}
