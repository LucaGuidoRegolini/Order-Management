import { getRepository, Repository } from 'typeorm';

import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { Client } from '../entities/Client';
import { ICreateClientDTO } from '../dtos/ICreateClientDTO';
import { Email } from '../entities/Email';
import { IClientRepository } from '../interfaces/IClientRepository';

export class ClientRepository implements IClientRepository {
  private ormRepository: Repository<Client>;

  private emailRepository: Repository<Email>;

  constructor() {
    this.ormRepository = getRepository(Client);
    this.emailRepository = getRepository(Email);
  }

  public async findBy(filters: Partial<Client>): Promise<Client | undefined> {
    const client = await this.ormRepository.findOne({ where: filters });

    return client;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
  }: IPaginatedRequest<Client>): Promise<IPaginatedResponse<Client>> {
    const clients = await this.ormRepository.find({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
    });

    const clientTotal = await this.ormRepository.count(filters);

    return {
      results: clients,
      total: clientTotal,
      page,
      limit,
    };
  }

  public async create({
    client_pipedrive_id,
    name,
    emails,
    user_id,
  }: ICreateClientDTO): Promise<Client> {
    const createdEmails = await Promise.all(
      emails.map(async email => {
        const emailEntity = this.emailRepository.create({
          email,
        });

        await this.emailRepository.save(emailEntity);

        return emailEntity;
      }),
    );

    const client = this.ormRepository.create({
      client_pipedrive_id,
      name,
      email: createdEmails,
      user_id,
    });

    await this.ormRepository.save(client);

    return client;
  }

  public async save(client: Client): Promise<Client> {
    return this.ormRepository.save(client);
  }

  public async delete(client: Client): Promise<void> {
    await this.ormRepository.remove(client);
  }
}
