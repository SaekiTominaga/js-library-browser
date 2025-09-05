import { describe, test, expect } from '@jest/globals';
import PopoverClass from './PopoverClass.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new PopoverClass(undefined).name).toBeUndefined();
	});

	test('text', () => {
		expect(new PopoverClass('text').name).toBe('text');
	});
});
