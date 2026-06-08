import { expect, test } from '@jest/globals';
import Ignore from './Ignore.ts';

test('no attribute', () => {
	expect(new Ignore(undefined).selectors).toBeUndefined();
});

test('selectors', () => {
	expect(new Ignore('.foo').selectors).toBe('.foo');
});
