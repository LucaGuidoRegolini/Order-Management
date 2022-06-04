import { CronJob } from 'cron';
import { container } from 'tsyringe';

import { GetNewDealsForAllUsersService } from '@shared/services/GetNewDealsForAllUsersService';

const job = new CronJob('*/30 * * * *', () => {
  const getNewDealsForAllUsersService = container.resolve(
    GetNewDealsForAllUsersService,
  );

  getNewDealsForAllUsersService.execute();
});

job.start();
