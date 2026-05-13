export function pluralizeRu(
  count: number,
  [one, few, many]: readonly [string, string, string],
) {
  const absCount = Math.abs(count);
  const lastTwoDigits = absCount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many;
  }

  const lastDigit = absCount % 10;

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  return many;
}
