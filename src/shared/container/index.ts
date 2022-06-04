import { container } from 'tsyringe';

import './providers';

import { UserRepository } from '@modules/users/repositories/UserRepository';
import { IUserRepository } from '@modules/users/interfaces/IUserRepository';

import { DealRepository } from '@modules/deals/repositories/DealRepository';
import { IDealRepository } from '@modules/deals/interfaces/IDealRepository';

import { ClientRepository } from '@modules/deals/repositories/ClientRepository';
import { IClientRepository } from '@modules/deals/interfaces/IClientRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IDealRepository>('DealRepository', DealRepository);

container.registerSingleton<IClientRepository>(
  'ClientRepository',
  ClientRepository,
);
