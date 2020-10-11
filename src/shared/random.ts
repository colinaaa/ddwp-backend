import Redis from 'ioredis';
import Lock from 'redlock';

import { RedisConfig } from './constants';

const redisClient = new Redis({ ...RedisConfig, keyPrefix: 'random:' });
const lock = new Lock([redisClient]);

export const random = (from: number, to: number): number =>
  // eslint-disable-next-line no-bitwise
  ~~(Math.random() * (to - from) + from);

export const randomUnique = async (from: number, to: number): Promise<number> => {
  const rand = random(from, to);

  const l = await lock.acquire('lock', 2000);

  const res = await redisClient.get(rand.toString());

  if (res !== null || res === '1') {
    l.unlock();
    return randomUnique(from, to);
  }
  await redisClient.setex(rand.toString(), 60 * 24, '1');

  l.unlock();
  return rand;
};

export const randomRoomNumber = async (length = 5): Promise<number> =>
  randomUnique(10 ** (length - 1), 10 ** length);
