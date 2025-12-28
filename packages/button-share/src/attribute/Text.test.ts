import { expect, test } from '@jest/globals';
import Text from './Text.ts';

test('no attribute', () => {
	expect(new Text(undefined).text).toBeUndefined();
});

test('text', () => {
	expect(new Text('text').text).toBe('text');
});
