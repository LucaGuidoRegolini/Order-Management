import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICreateClientDTO } from '../dtos/ICreateClientDTO';
import { Client } from '../entities/Client';

export interface IClientRepository {
  /**
   * Find a client by any field
   */
  findBy(filters: Partial<Client>): Promise<Client | undefined>;

  /**
   * List all clients by any field and pagination the results
   */
  listBy(data: IPaginatedRequest<Client>): Promise<IPaginatedResponse<Client>>;

  /**
   * Create a new client with the ICreateClientDTO interface
   */
  create(data: ICreateClientDTO): Promise<Client>;

  /**
   * Update a client by a complete Client object
   */
  save(client: Client): Promise<Client>;

  /**
   * Delete a client by a complete Client object
   */
  delete(client: Client): Promise<void>;
}
