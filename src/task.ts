import { CronJob } from 'cron';

import { WerewolfRoomModel } from '@models/werewolf/room';
import logger from '@shared/Logger';

const task = new CronJob('0 0 0 * * *', async () => {
  logger.info('%s running cronjob', new Date().toLocaleString());
  const res = await WerewolfRoomModel.deleteMany({
    $or: [{ isEnd: true }, { isBegin: false }],
  });
  logger.info('delete %s room', res.deletedCount);
});

export { task };

export default task;
