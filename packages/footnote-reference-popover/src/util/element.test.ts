import { describe, expect, test } from '@jest/globals';
import { getUniqueCSSAnchorName } from './element.ts';

describe('getAnchorName', () => {
	test('no prefix', () => {
		expect(getUniqueCSSAnchorName()).toMatch(/--[0-9a-z]{32}/u);
	});

	test('prefix', () => {
		expect(getUniqueCSSAnchorName('foo-')).toMatch(/--foo-[0-9a-z]{32}/u);
	});
});
