import { connect, set } from 'mongoose';

import logger from '@shared/Logger';
import { MongoConfig } from '@shared/constants';

set('useFindAndModify', false);

connect(MongoConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('connect to mongodb'))
  .catch((error) => logger.error(error));
