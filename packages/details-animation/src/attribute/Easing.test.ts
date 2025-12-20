import { expect, test } from '@jest/globals';
import Easing from './Easing.ts';

test('undefined', () => {
	expect(new Easing(undefined).value).toBeUndefined();
});

test('not allowed value', () => {
	expect(() => {
		new Easing('xxx');
	}).toThrow(
		'The value of the `data-easing` attribute must be "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier", "step-start", "step-end", or "steps".',
	);
});

test('allowed value', () => {
	expect(new Easing('ease').value).toBe('ease');
});
