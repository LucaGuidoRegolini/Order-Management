import { container } from 'tsyringe';
import { PipedriveProvider } from './implementations/PipedriveProvider';
import { IPipedriveProvider } from './model/IPipedriveProvider';

container.registerSingleton<IPipedriveProvider>(
  'PipedriveProvider',
  PipedriveProvider,
);
