import { connect, disconnect } from 'mongoose';
import { redisClient, redisCache } from '../src/shared/redis';

beforeAll(async () => {
  await connect('mongodb://localhost/jest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await disconnect();
  await redisCache.close();
  await redisClient.quit();
});
