import Redis, { KeyType } from 'ioredis';
import { RedisCache } from 'apollo-server-cache-redis';

import { RedisConfig } from './constants';
import logger from './Logger';

export const redisClient = new Redis(RedisConfig);

redisClient.on('error', logger.error);

export const getThenDel = async (key: KeyType): Promise<string | null> => {
  // [[null, 'foo'], [null, 'OK']]
  const [result] = await redisClient.pipeline().get(key).del(key).exec();

  // [Error, 'bar']
  const [, value] = result;

  return value;
};

export const redisCache = new RedisCache(RedisConfig);

export default redisClient;
