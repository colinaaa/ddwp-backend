enum LineUp {
  STANDARD_NINE,
}

// TODO: fill the lineup
const mapLineupToPlayerNumbers = (lineup: LineUp): number => {
  switch (lineup) {
    case LineUp.STANDARD_NINE:
      return 9;
    default:
      return 1;
  }
};

export { LineUp, mapLineupToPlayerNumbers };

export default LineUp;
