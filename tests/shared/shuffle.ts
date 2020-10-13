import { shuffle } from '../../src/shared/shuffle';

describe('shuffle', () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const numSet = new Set(numbers);

  const objs = [
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 },
    { h: 8 },
    { i: 9 },
  ].map((obj, index) => ({
    ...obj,
    index,
  }));

  it('should shuffle randomly', () => {
    const res = shuffle(numbers);

    expect(res.length).toBe(numbers.length);
    expect(res.every((num) => numSet.has(num))).toBe(true);
    expect(res.every((num, index) => num === numbers[index])).toBe(false);
  });

  it('should be able to shuffle array of objects', () => {
    const res = shuffle(objs);

    expect(res.length).toBe(objs.length);
    expect(res.every((obj, index) => obj.index === index)).toBe(false);
  });
});
