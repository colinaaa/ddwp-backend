import { words, randomWords } from '../../src/database/models/undercover/words';

describe('word test', () => {
  it('should get some words', () => {
    const [f, s] = randomWords();

    expect(f).toBeTruthy();
    expect(s).toBeTruthy();

    expect(words.find(([fst, snd]) => fst === f && s === snd)).toHaveLength(2);
  });
});
