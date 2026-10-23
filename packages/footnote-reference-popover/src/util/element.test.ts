import { describe, expect, test } from '@jest/globals';
import { getAnchorName } from './element.ts';

describe('getAnchorName', () => {
	test('no prefix', () => {
		expect(getAnchorName()).toMatch(/--[0-9a-z]{32}/u);
	});

	test('prefix', () => {
		expect(getAnchorName('foo-')).toMatch(/--foo-[0-9a-z]{32}/u);
	});
});
