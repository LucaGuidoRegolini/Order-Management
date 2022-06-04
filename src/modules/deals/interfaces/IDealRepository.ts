import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICreateDealDTO } from '../dtos/ICreateDealDTO';
import { IListDealDTO } from '../dtos/IListDealDTO';
import { Deal } from '../entities/Deal';

export interface IDealRepository {
  /**
   * Find a deal by any field
   */
  findBy(filters: Partial<Deal>): Promise<Deal | undefined>;

  /**
   * List all deals by any field and pagination the results
   */
  listBy(data: IListDealDTO): Promise<IPaginatedResponse<Deal>>;

  /**
   * Index all deals
   */
  index(filters: Partial<Deal>): Promise<Deal[]>;

  /**
   * Create a new deal with the ICreateDealDTO interface
   */
  create(data: ICreateDealDTO): Promise<Deal>;

  /**
   * Update a deal by a complete Deal object
   */
  save(deal: Deal): Promise<Deal>;

  /**
   * Delete a deal by a complete Deal object
   */
  delete(deal: Deal): Promise<void>;
}
