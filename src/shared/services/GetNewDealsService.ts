import { inject, injectable } from 'tsyringe';

import { IClientRepository } from '@modules/deals/interfaces/IClientRepository';
import { IDealRepository } from '@modules/deals/interfaces/IDealRepository';
import { IPipedriveProvider } from '@shared/container/providers/PipedriveProvider/model/IPipedriveProvider';
import { IUserRepository } from '@modules/users/interfaces/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export class GetNewDealsService {
  constructor(
    @inject('DealRepository')
    private dealsRepository: IDealRepository,

    @inject('ClientRepository')
    private clientsRepository: IClientRepository,

    @inject('PipedriveProvider')
    private pipedriveProvider: IPipedriveProvider,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<void> {
    const user = await this.userRepository.findBy({ id: user_id });

    if (!user) throw new Error('Usuário não encontrado');

    const deals = await this.pipedriveProvider.getDeals(
      'won',
      user.pipedrive_token,
    );

    const requests = await this.dealsRepository.index({
      user_id,
    });

    const requestIds = requests.map(request => request.pipedrive_id);

    const newDeals = deals.filter(deal => !requestIds.includes(deal.id));

    await Promise.all(
      newDeals.map(async deal => {
        let client = await this.clientsRepository.findBy({
          client_pipedrive_id: deal.client_id,
        });

        if (!client) {
          client = await this.clientsRepository.create({
            name: deal.client_name,
            client_pipedrive_id: deal.client_id,
            emails: deal.client_email,
            user_id,
          });
        }

        await this.dealsRepository.create({
          pipedrive_id: deal.id,
          client_id: client.id,
          user_id,
          title: deal.title,
          value: deal.value,
          product_count: deal.product_count,
          deal_date: deal.deal_date,
          user_pipedrive_id: deal.user_id,
        });
      }),
    );
  }
}
