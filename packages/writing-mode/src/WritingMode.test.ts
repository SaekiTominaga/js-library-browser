import { test, expect } from '@jest/globals';
import WritingMode from './WritingMode.ts';

test('horizontal-tb', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: horizontal-tb');

	const writingMode = new WritingMode(element);

	expect(writingMode.value).toBe('horizontal-tb');
	expect(writingMode.isHorizontal()).toBeTruthy();
	expect(writingMode.isVertical()).toBeFalsy();
});

test('vertical-rl', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: vertical-rl');

	const writingMode = new WritingMode(element);

	expect(writingMode.value).toBe('vertical-rl');
	expect(writingMode.isHorizontal()).toBeFalsy();
	expect(writingMode.isVertical()).toBeTruthy();
});

test('vertical-lr', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: vertical-lr');

	const writingMode = new WritingMode(element);

	expect(writingMode.value).toBe('vertical-lr');
	expect(writingMode.isHorizontal()).toBeFalsy();
	expect(writingMode.isVertical()).toBeTruthy();
});

test('sideways-rl', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: sideways-rl');

	const writingMode = new WritingMode(element);

	expect(writingMode.value).toBe('sideways-rl');
	expect(writingMode.isHorizontal()).toBeFalsy();
	expect(writingMode.isVertical()).toBeTruthy();
});

test('sideways-lr', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: sideways-lr');

	const writingMode = new WritingMode(element);

	expect(writingMode.value).toBe('sideways-lr');
	expect(writingMode.isHorizontal()).toBeFalsy();
	expect(writingMode.isVertical()).toBeTruthy();
});

test('invalid value', () => {
	const element = document.createElement('div');
	element.setAttribute('style', 'writing-mode: xxx');

	expect(() => {
		new WritingMode(element);
	}).toThrow('Unexpected `writing-mode` value: xxx');
});
