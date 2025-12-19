import { expect, test } from '@jest/globals';
import PopoverClass from './PopoverClass.ts';

test('no attribute', () => {
	expect(new PopoverClass(undefined).name).toBeUndefined();
});

test('text', () => {
	expect(new PopoverClass('text').name).toBe('text');
});
