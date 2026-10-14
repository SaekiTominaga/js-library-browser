import { beforeAll, describe, expect, test } from '@jest/globals';
import { allowAlertRole } from './element.ts';

beforeAll(() => {
	document.body.innerHTML = `
<body>
	<a></a>
	<a href=""></a>
	<b></b>
	<x-x></x-x>
</body>
`;
});

describe('allowAlertRole', () => {
	test('a with href', () => {
		const $ = document.querySelector('a[href]')!;

		expect(allowAlertRole($)).toBeFalsy();
	});

	test('a without href', () => {
		const $ = document.querySelector('a:not([href])')!;

		expect(allowAlertRole($)).toBeTruthy();
	});

	test('Any role', () => {
		const $ = document.querySelector('b')!;

		expect(allowAlertRole($)).toBeTruthy();
	});

	test('No role', () => {
		const $ = document.querySelector('body')!;

		expect(allowAlertRole($)).toBeFalsy();
	});

	test('Autonomous custom elements', () => {
		const $ = document.querySelector('x-x')!;

		expect(allowAlertRole($)).toBeTruthy();
	});
});
