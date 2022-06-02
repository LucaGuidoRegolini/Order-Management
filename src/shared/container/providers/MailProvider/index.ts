import { container } from 'tsyringe';
import { mailConfig } from '@config/mail';

import { IMailProvider } from './models/IMailProvider';

import { EtherealMailProvider } from './implementations/EtherealMailProvider';
import { SESMailProvider } from './implementations/SESMailProvider';
import { SendinBlueProvider } from './implementations/SendBlueMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
  sandinblue: container.resolve(SendinBlueProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
