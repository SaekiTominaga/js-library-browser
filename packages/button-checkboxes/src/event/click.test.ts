import { beforeEach, expect, test } from '@jest/globals';
import Checkbox from '../attribute/Checkbox.ts';
import Course from '../attribute/Course.ts';
import clickEvent from './click.ts';

beforeEach(() => {
	document.body.innerHTML = `
<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
</span>
`;
});

test('全選択', () => {
	const event = new MouseEvent('click');
	const course = new Course('check');
	const checkbox = new Checkbox({ id: 'checkboxes' });

	const $checkboxes = checkbox.elements;
	expect($checkboxes.filter((element) => element.checked).length).toBe(1);
	expect($checkboxes.filter((element) => !element.checked).length).toBe(1);

	clickEvent(event, course, checkbox);

	expect($checkboxes.every((element) => element.checked)).toBeTruthy();
});

test('全解除', () => {
	const event = new MouseEvent('click');
	const course = new Course('uncheck');
	const checkbox = new Checkbox({ id: 'checkboxes' });

	const $checkboxes = checkbox.elements;
	expect($checkboxes.filter((element) => element.checked).length).toBe(1);
	expect($checkboxes.filter((element) => !element.checked).length).toBe(1);

	clickEvent(event, course, checkbox);

	expect($checkboxes.every((element) => !element.checked)).toBeTruthy();
});
