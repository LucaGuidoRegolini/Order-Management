import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { Deal } from '../entities/Deal';

export interface IListDealDTO extends IPaginatedRequest<Deal> {
  initial_date?: Date;
  final_date?: Date;
}
