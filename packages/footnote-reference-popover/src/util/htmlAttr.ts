/**
 * Convert CSS Duration Units to Milliseconds
 *
 * @param value - Time Notation for Humans (e.g. 1s, 10ms)
 *
 * @returns Millisecond value
 */
const formatNumber = (value: number): string => String(Number(value.toFixed(3)));

export { formatNumber };
