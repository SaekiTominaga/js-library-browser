import { expect, test } from '@jest/globals';
import Title from './Title.ts';

test('no attribute', () => {
	expect(new Title(undefined).value).toBeUndefined();
});

test('string', () => {
	expect(new Title('text').value).toBe('text');
});
