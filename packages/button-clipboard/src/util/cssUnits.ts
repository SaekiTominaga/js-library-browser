/**
 * Convert CSS Duration Units to Milliseconds
 *
 * @param str - Time Notation for Humans (e.g. 1s, 10ms)
 *
 * @returns Millisecond value
 */
const parseDuration = (str: string): number => {
	const UNITS = {
		s: 1000,
		ms: 1,
	}; // CSS Duration Units <https://drafts.csswg.org/css-values-3/#time>

	const match = new RegExp(`^(?<value>-?[0-9]*\\.?[0-9]+)(?<unit>${Object.keys(UNITS).join('|')})$`, 'u').exec(str);
	if (match === null) {
		throw new Error(`Invalid time format: ${str}`);
	}

	const { value, unit } = match.groups as {
		value: string;
		unit: keyof typeof UNITS;
	};

	return Number(value) * UNITS[unit];
};

export { parseDuration };
