import { IPaginatedRequest } from '@shared/interfaces/IPaginatedrequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICreatePermissionDTO } from '../dtos/ICreatePermissionDTO';

import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
  /***
   * Find a permission by any field
   */
  findBy(filter: Partial<Permission>): Promise<Permission | undefined>;

  /***
   * List all permission by any field and pagination the results
   */
  listBy(
    data: IPaginatedRequest<Permission>,
  ): Promise<IPaginatedResponse<Permission>>;

  /***
   * Create a new permission with the ICreatePermissionDTO interface
   */
  create(data: ICreatePermissionDTO): Promise<Permission>;

  /***
   * Update a permission by a complete Permission object
   */
  save(permission: Permission): Promise<Permission>;

  /***
   * Delete a permission by a complete Permission object
   */
  delete(permission: Permission): Promise<void>;
}
