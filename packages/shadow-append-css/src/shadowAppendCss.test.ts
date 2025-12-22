import { test, expect, beforeAll } from '@jest/globals';
import shadowAppendCss from './shadowAppendCss.ts';

const cssString = ':host { color: red }';

beforeAll(() => {
	class MyElement extends HTMLElement {
		constructor() {
			super();

			shadowAppendCss(this.attachShadow({ mode: 'open' }), cssString);
		}
	}

	customElements.define('my-element', MyElement);
});

test('not support', () => {
	Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
		get() {
			return undefined;
		},
	});

	expect(document.createElement('my-element').shadowRoot?.querySelector('style')?.textContent).toBe(cssString);
});
