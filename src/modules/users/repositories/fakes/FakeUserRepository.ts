import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/entities/User';
import { IUserRepository } from '@modules/users/interfaces/IUserRepository';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { v4 } from 'uuid';

export class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  public async findBy(
    filters: Partial<User>,
    deleted_to?: boolean,
  ): Promise<User | undefined> {
    const filter = deleted_to
      ? filters
      : {
          is_deleted: false,
          ...filters,
        };
    const user = this.users.find(findUser => {
      return Object.keys(filter).every(key => {
        return findUser[key] === filter[key];
      });
    });

    return user;
  }

  public async index(): Promise<User[]> {
    return this.users;
  }

  public async listBy(
    { filters, page = 1, limit = 10 }: IPaginatedRequest<User>,
    deleted_to?: boolean,
  ): Promise<IPaginatedResponse<User>> {
    const filter = deleted_to
      ? filters
      : {
          is_deleted: false,
          ...filters,
        };
    const users = this.users.filter(findUser => {
      return filter
        ? Object.keys(filter).every(key => findUser[key] === filter[key])
        : true;
    });

    const userTotal = users.length;

    const paginatedUsers = users.slice((page - 1) * limit);

    return {
      results: paginatedUsers,
      total: userTotal,
      page,
      limit,
    };
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: v4(),
      ...userData,
      is_deleted: false,
      email_active: true,
    });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async delete(user: User): Promise<void> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users.splice(findIndex, 1);
  }
}
