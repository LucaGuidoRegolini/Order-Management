import { v4 } from 'uuid';

import { ICreateClientDTO } from '@modules/deals/dtos/ICreateClientDTO';
import { Client } from '@modules/deals/entities/Client';
import { IClientRepository } from '@modules/deals/interfaces/IClientRepository';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';

export class FakeClientRepository implements IClientRepository {
  private clients: Client[] = [];

  public async findBy(filters: Partial<Client>): Promise<Client | undefined> {
    const client = this.clients.find(findClient => {
      return Object.keys(filters).every(key => {
        return findClient[key] === filters[key];
      });
    });

    return client;
  }

  public async listBy({
    filters,
    page = 1,
    limit = 10,
  }: IPaginatedRequest<Client>): Promise<IPaginatedResponse<Client>> {
    const clients = this.clients.filter(findClient => {
      return filters
        ? Object.keys(filters).every(key => findClient[key] === filters[key])
        : true;
    });

    const clientTotal = clients.length;

    const paginatedClients = clients.slice((page - 1) * limit);

    return {
      results: paginatedClients,
      total: clientTotal,
      page,
      limit,
    };
  }

  public async create(clientData: ICreateClientDTO): Promise<Client> {
    const client = new Client();

    Object.assign(client, {
      id: v4(),
      ...clientData,
    });

    this.clients.push(client);

    return client;
  }

  public async save(client: Client): Promise<Client> {
    const findIndex = this.clients.findIndex(
      findUser => findUser.id === client.id,
    );

    this.clients[findIndex] = client;

    return client;
  }

  public async delete(client: Client): Promise<void> {
    const findIndex = this.clients.findIndex(
      findUser => findUser.id === client.id,
    );

    this.clients.splice(findIndex, 1);
  }
}
