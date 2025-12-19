import { expect, test } from '@jest/globals';
import PopoverLabel from './PopoverLabel.ts';

test('no attribute', () => {
	expect(new PopoverLabel(undefined).text).toBeUndefined();
});

test('text', () => {
	expect(new PopoverLabel('text').text).toBe('text');
});
