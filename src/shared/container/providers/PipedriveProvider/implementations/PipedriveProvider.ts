/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipedriveApi } from '@shared/apis/PipedriveApi';
import { AppError } from '@shared/errors/AppError';
import { IDealDTO } from '../dtos/IDealDTO';
import { IPipedriveProvider } from '../model/IPipedriveProvider';

export class PipedriveProvider implements IPipedriveProvider {
  async getDeals(statusDeal: string, api_token: string): Promise<IDealDTO[]> {
    const pipedriveApi = PipedriveApi(api_token);

    let response;

    try {
      response = await pipedriveApi.get(`/deals?status=${statusDeal}`);
    } catch (error) {
      throw new AppError('Pipedrive Error');
    }

    const apiDeals = response.data.data;

    const deals: IDealDTO[] = apiDeals.map((apiDeal: any) => {
      const emails: string[] = apiDeal.person_id.email.map(
        (email: any) => email.value,
      );

      return {
        id: apiDeal.id,
        title: apiDeal.title,
        value: apiDeal.value,
        product_count: apiDeal.products_count,
        client_id: apiDeal.person_id.value,
        client_name: apiDeal.person_id.name,
        client_email: emails,
        user_id: apiDeal.user_id.id,
        deal_date: apiDeal.add_time,
      };
    });

    return deals;
  }
}
