import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import Tab from './Tab.ts';

beforeAll(() => {
	customElements.define('my-tab', Tab);
});

describe('Storage', () => {
	let consoleInfoSpy: SpiedFunction;

	beforeEach(() => {
		consoleInfoSpy = jest.spyOn(console, 'info');
	});

	afterEach(() => {
		sessionStorage.clear();
		consoleInfoSpy.mockRestore();
	});

	test('no exist id', () => {
		sessionStorage.setItem('x', 'foo');

		document.body.innerHTML = `<my-tab storage-key="x"></my-tab>`;

		expect(consoleInfoSpy).toHaveBeenCalledWith('[tab] Element `#foo` not found.');
	});
});

describe('tab', () => {
	test('mismatch element name', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<p slot="tab"></p>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(TypeError);
		expect(errors[0]?.message).toBe('Element `[slot=tab]` must be a `<a>` element');
	});

	test('no href', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<a slot="tab"></a>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('The `href` attribute of element `a[slot=tab]` does not contain a hash');
	});

	test('no hash', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<a href="foo" slot="tab"></a>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('The `href` attribute of element `a[slot=tab]` does not contain a hash');
	});

	test('empty hash', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<a href="#" slot="tab"></a>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('The `href` attribute of element `a[slot=tab]` does not contain a hash');
	});

	test('no tabpanel', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<a href="#foo" slot="tab"></a>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('Element `#foo` not found');
	});

	test('mismatch tabpanel slot', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
				<my-tab>
					<a href="#foo" slot="tab"></a>
					<div slot="bar" id="foo"></div>
				</my-tab>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('Element `#foo` does not have the appropriate `slot` attribute set');
	});
});

describe('attributes', () => {
	beforeAll(() => {
		document.body.innerHTML = `
			<my-tab>
				<a href="#tabpanel1" slot="tab"></a>
				<a href="#tabpanel2" slot="tab"></a>
				<div id="tabpanel1" slot="tabpanel"></div>
				<div id="tabpanel2" slot="tabpanel"></div>
			</my-tab>
		`;

		sessionStorage.setItem('test-attributes', 'tabpanel2');
	});

	afterAll(() => {
		sessionStorage.clear();
	});

	test('tablist-label', () => {
		const $tab = document.querySelector<Tab>('my-tab')!;
		const $tablist = $tab.shadowRoot?.querySelector<HTMLElement>('[part~="tablist"]');

		expect($tab.tablistLabel).toBeUndefined();
		expect($tablist?.ariaLabel).toBeNull();

		$tab.tablistLabel = 'foo1';
		expect($tab.tablistLabel).toBe('foo1');
		expect($tablist?.ariaLabel).toBe('foo1');

		$tab.tablistLabel = undefined;
		expect($tab.tablistLabel).toBeUndefined();
		expect($tablist?.ariaLabel).toBeNull();

		$tab.setAttribute('tablist-label', 'foo2');
		expect($tab.tablistLabel).toBe('foo2');
		expect($tablist?.ariaLabel).toBe('foo2');
	});

	test('storage-key', () => {
		const $tab = document.querySelector<Tab>('my-tab')!;
		const $tabs = $tab.querySelectorAll('[slot="tab"]');
		const $tab1 = $tabs.item(0);
		const $tab2 = $tabs.item(1);

		expect($tab.storageKey).toBeUndefined();

		$tab.storageKey = 'test-attributes';
		expect($tab.storageKey).toBe('test-attributes');
		expect($tab1.ariaSelected).toBe('false');
		expect($tab2.ariaSelected).toBe('true');

		$tab.storageKey = undefined;
		expect($tab.storageKey).toBeUndefined();
		expect($tab1.ariaSelected).toBe('true');
		expect($tab2.ariaSelected).toBe('false');

		$tab.setAttribute('storage-key', 'test-attributes');
		expect($tab.storageKey).toBe('test-attributes');
		expect($tab1.ariaSelected).toBe('false');
		expect($tab2.ariaSelected).toBe('true');
	});
});
