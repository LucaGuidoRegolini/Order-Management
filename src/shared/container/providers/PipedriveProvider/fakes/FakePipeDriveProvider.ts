import { IDealDTO } from '../dtos/IDealDTO';
import { IPipedriveProvider } from '../model/IPipedriveProvider';

export class FakePipeDriveProvider implements IPipedriveProvider {
  private deals: IDealDTO[] = [
    {
      id: 1,
      title: 'Deal 1',
      value: 100,
      product_count: 1,
      client_id: 1,
      client_name: 'Client 1',
      client_email: ['client@example.com'],
      user_id: 1,
      deal_date: new Date('2022-06-04 09:49:41'),
    },
  ];

  async getDeals(_statusDeal: string, _api_token: string): Promise<IDealDTO[]> {
    return this.deals;
  }
}
