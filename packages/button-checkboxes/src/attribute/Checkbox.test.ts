import { describe, afterEach, test, expect } from '@jest/globals';
import Checkbox from './Checkbox.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Checkbox({ id: undefined, class: undefined, name: undefined });
		}).toThrow('The `data-control` or `data-controls-class` or `data-controls-name` attribute is not set.');
	});

	test('all attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" checked="" />
</span>

<input type="checkbox" name="checkbox-name" id="checkbox3" />
<input type="checkbox" name="checkbox-name" id="checkbox4" checked="" />

<input type="checkbox" class="checkbox-class" id="checkbox5" />
<input type="checkbox" class="checkbox-class" id="checkbox6" checked="" />
`,
		);

		const checkboxes = new Checkbox({ id: 'checkboxes', class: 'checkbox-class', name: 'checkbox-name' }).elements;

		expect(checkboxes.length).toBe(6);
		expect(checkboxes[0]?.id).toBe('checkbox1');
		expect(checkboxes[1]?.id).toBe('checkbox2');
		expect(checkboxes[2]?.id).toBe('checkbox5');
		expect(checkboxes[3]?.id).toBe('checkbox6');
		expect(checkboxes[4]?.id).toBe('checkbox3');
		expect(checkboxes[5]?.id).toBe('checkbox4');
	});
});

describe('constructor - data-control', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no id', () => {
		expect(() => {
			new Checkbox({ id: 'xxx', class: undefined, name: undefined });
		}).toThrow('Element `#xxx` not found.');
	});

	test('no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<span id="checkboxes">
</span>
`,
		);

		expect(() => {
			new Checkbox({ id: 'checkboxes', class: undefined, name: undefined });
		}).toThrow('Checkbox does not exist in descendants of the element `#checkboxes`.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`,
		);

		const checkboxes = new Checkbox({ id: 'checkboxes', class: undefined, name: undefined }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0]?.id).toBe('checkbox1');
	});
});

describe('constructor - data-controls-class', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no checkbox', () => {
		expect(() => {
			new Checkbox({ id: undefined, class: 'xxx', name: undefined });
		}).toThrow('Element `.xxx` not found.');
	});

	test('not input', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p class="checkbox"></p>
`,
		);

		expect(() => {
			new Checkbox({ id: undefined, class: 'checkbox', name: undefined });
		}).toThrow('Element `.checkbox` is not a `HTMLInputElement`.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="checkbox" class="checkbox" id="checkbox1" />
`,
		);

		const checkboxes = new Checkbox({ id: undefined, class: 'checkbox', name: undefined }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0]?.id).toBe('checkbox1');
	});
});

describe('constructor - data-controls-name', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new Checkbox({ id: undefined, class: undefined, name: 'xxx' });
		}).toThrow('Element `[name=xxx]` not found.');
	});

	test('not input', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<select name="checkbox"></select>
`,
		);

		expect(() => {
			new Checkbox({ id: undefined, class: undefined, name: 'checkbox' });
		}).toThrow('Element `[name=checkbox]` is not a `HTMLInputElement`.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		const checkboxes = new Checkbox({ id: undefined, class: undefined, name: 'checkbox' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0]?.id).toBe('checkbox1');
	});
});
