import { getRepository, Repository } from 'typeorm';

import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { User } from '../entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';

import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

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

    const user = await this.ormRepository.findOne({ where: filter });

    return user;
  }

  public async listBy(
    { page = 1, limit = 10, filters }: IPaginatedRequest<User>,
    deleted_to?: boolean,
  ): Promise<IPaginatedResponse<User>> {
    const filter = deleted_to
      ? filters
      : {
          is_deleted: false,
          ...filters,
        };

    const users = await this.ormRepository.find({
      where: filter,
      skip: (page - 1) * limit,
      take: limit,
    });

    const userTotal = await this.ormRepository.count(filters);

    return {
      results: users,
      total: userTotal,
      page,
      limit,
    };
  }

  public async create({
    name,
    email,
    password,
    pipedrive_token,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      pipedrive_token,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}
