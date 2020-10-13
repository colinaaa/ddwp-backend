import { CronJob } from 'cron';

import { RoomModel } from '@models/room';
import logger from '@shared/Logger';

const task = new CronJob('0 0 0 * * *', async () => {
  logger.info('%s running cronjob', new Date().toLocaleString());
  const res = await RoomModel.deleteMany({ $or: [{ isEnd: true }, { isBegin: false }] });
  logger.info('delete %s room', res.deletedCount);
});

export { task };

export default task;
