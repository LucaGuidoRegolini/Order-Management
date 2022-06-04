import { CronJob } from 'cron';
import { container } from 'tsyringe';

import { DeleteUserDeletedService } from '@shared/services/DeleteUserDeletedService';

const job = new CronJob('0 1 * * *', () => {
  const deleteUserDeletedService = container.resolve(DeleteUserDeletedService);

  deleteUserDeletedService.execute();
});

job.start();
