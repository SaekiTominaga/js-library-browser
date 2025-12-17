import { describe, expect, test } from '@jest/globals';
import Checkbox from './Checkbox.ts';

test('no attribute', () => {
	expect(() => {
		new Checkbox({});
	}).toThrow('The `data-control` or `data-controls-class` or `data-controls-name` attribute is not set.');
});

test('all attributes', () => {
	document.body.innerHTML = `
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" checked="" />
</span>

<input type="checkbox" name="checkbox-name" id="checkbox3" />
<input type="checkbox" name="checkbox-name" id="checkbox4" checked="" />

<input type="checkbox" class="checkbox-class" id="checkbox5" />
<input type="checkbox" class="checkbox-class" id="checkbox6" checked="" />
`;

	const checkboxes = new Checkbox({ id: 'checkboxes', class: 'checkbox-class', name: 'checkbox-name' }).elements;

	expect(checkboxes.length).toBe(6);
	expect(checkboxes.at(0)?.id).toBe('checkbox1');
	expect(checkboxes.at(1)?.id).toBe('checkbox2');
	expect(checkboxes.at(2)?.id).toBe('checkbox5');
	expect(checkboxes.at(3)?.id).toBe('checkbox6');
	expect(checkboxes.at(4)?.id).toBe('checkbox3');
	expect(checkboxes.at(5)?.id).toBe('checkbox4');
});

describe('id', () => {
	test('no id', () => {
		expect(() => {
			new Checkbox({ id: 'xxx' });
		}).toThrow('Element `#xxx` not found.');
	});

	test('no checkbox', () => {
		document.body.innerHTML = `<span id="checkboxes"></span>`;

		expect(() => {
			new Checkbox({ id: 'checkboxes' });
		}).toThrow('Checkbox does not exist in descendants of the element `#checkboxes`.');
	});

	test('exist checkboxes', () => {
		document.body.innerHTML = `
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`;

		const checkboxes = new Checkbox({ id: 'checkboxes' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes.at(0)?.id).toBe('checkbox1');
	});
});

describe('class', () => {
	test('no checkbox', () => {
		expect(() => {
			new Checkbox({ class: 'xxx' });
		}).toThrow('Element `.xxx` not found.');
	});

	test('not input', () => {
		document.body.innerHTML = `<p class="checkbox"></p>`;

		expect(() => {
			new Checkbox({ class: 'checkbox' });
		}).toThrow('Element `.checkbox` is not a `HTMLInputElement`.');
	});

	test('exist checkboxes', () => {
		document.body.innerHTML = `<input type="checkbox" class="checkbox" id="checkbox1" />`;

		const checkboxes = new Checkbox({ class: 'checkbox' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes.at(0)?.id).toBe('checkbox1');
	});
});

describe('name', () => {
	test('no checkbox', () => {
		document.body.innerHTML = `<input type="checkbox" name="checkbox" id="checkbox1" />`;

		expect(() => {
			new Checkbox({ name: 'xxx' });
		}).toThrow('Element `[name=xxx]` not found.');
	});

	test('not input', () => {
		document.body.innerHTML = `<select name="checkbox"></select>`;

		expect(() => {
			new Checkbox({ name: 'checkbox' });
		}).toThrow('Element `[name=checkbox]` is not a `HTMLInputElement`.');
	});

	test('exist checkboxes', () => {
		document.body.innerHTML = `<input type="checkbox" name="checkbox" id="checkbox1" />`;

		const checkboxes = new Checkbox({ name: 'checkbox' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes.at(0)?.id).toBe('checkbox1');
	});
});
