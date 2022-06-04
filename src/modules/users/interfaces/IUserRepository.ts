import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Find a user by any field
   * @param deleted_to get deleted users
   */
  findBy(
    filters: Partial<User>,
    deleted_to?: boolean,
  ): Promise<User | undefined>;

  /**
   * Find all users by any field
   */
  index(): Promise<User[]>;

  /**
   * List all users by any field and pagination the results
   *  @param deleted_to get deleted users
   */
  listBy(
    data: IPaginatedRequest<User>,
    deleted_to?: boolean,
  ): Promise<IPaginatedResponse<User>>;

  /**
   * Create a new user with the ICreateUserDTO interface
   */
  create(data: ICreateUserDTO): Promise<User>;

  /**
   * Update a user by a complete User object
   */
  save(user: User): Promise<User>;

  /**
   * Delete a user by a complete User object
   */
  delete(user: User): Promise<void>;
}
