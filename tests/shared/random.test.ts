import redisClient from '../../src/shared/redis';
import { random, randomRoomNumber, randomUnique } from '../../src/shared/random';

describe('random test', () => {
  const n = 100;
  const from = 100000;
  const to = 1000000;

  it('should get some random number', (done) => {
    Array(n)
      .fill(0)
      .map(() => random(from, to))
      .forEach((num) => {
        expect(`${num}`).toHaveLength(`${from}`.length);
        expect(num).toBeGreaterThan(from);
        expect(num).toBeLessThan(to);
      });

    done();
  });

  it('should get some unique random number', async () => {
    const set = new Set<number>();

    const res = await Promise.all(
      Array(n)
        .fill(0)
        .map(() => randomUnique(from, to))
    );

    res.forEach((num) => {
      expect(set.has(num)).toBeFalsy();
      set.add(num);
      expect(num).toBeGreaterThan(from);
      expect(num).toBeLessThan(to);
    });

    await Promise.all(res.map((num) => redisClient.del(num.toString())));
  });

  it('should return a room number with length 5', async () => {
    const room = await randomRoomNumber();

    expect(room.toString().length).toBe(5);
  });
});
