const shuffle = <T>(array: Array<T>): Array<T> => {
  const ret = [...array];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ret[i], ret[j]] = [ret[j], ret[i]];
  }

  return ret;
};

export { shuffle };

export default shuffle;
