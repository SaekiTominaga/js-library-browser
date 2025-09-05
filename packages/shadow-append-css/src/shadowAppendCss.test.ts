import { test, expect } from '@jest/globals';
import shadowAppendCss from './shadowAppendCss.ts';

test('not support `adoptedStyleSheets`', () => {
	const cssString = ':host { color: red }';

	class MyElement extends HTMLElement {
		constructor() {
			super();

			shadowAppendCss(this.attachShadow({ mode: 'open' }), cssString);
		}
	}

	customElements.define('my-element', MyElement);

	expect(document.createElement('my-element').shadowRoot?.querySelector('style')?.textContent).toBe(cssString);
});
