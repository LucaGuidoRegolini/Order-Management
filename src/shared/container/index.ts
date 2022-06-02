import { container } from 'tsyringe';

import './providers';

import { UserRepository } from '@modules/users/repositories/UserRepository';
import { IUserRepository } from '@modules/users/interfaces/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
