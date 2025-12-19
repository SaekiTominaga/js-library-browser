/**
 * Popover <https://github.com/jsdom/jsdom/issues/3721>
 */
if (document.documentElement.showPopover !== undefined) {
	throw new Error('`HTMLElement.showPopover()` is supported for Jest');
}

HTMLElement.prototype.showPopover = () => {};
HTMLElement.prototype.hidePopover = () => {};

/**
 * ShadowRoot: adoptedStyleSheets <https://github.com/jsdom/jsdom/issues/3444>
 */
if (document.documentElement.adoptedStyleSheets !== undefined) {
	throw new Error('`Document.adoptedStyleSheets()` is supported for Jest');
}

Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
	get() {
		return this._adoptedStyleSheets ?? [];
	},
	set(value) {
		this._adoptedStyleSheets = value;
	},
});

/**
 * CSSStyleSheet: replaceSync() <https://github.com/jsdom/jsdom/issues/3766>
 */
if (new CSSStyleSheet().replaceSync !== undefined) {
	throw new Error('`CSSStyleSheet.replaceSync()` is supported for Jest');
}

CSSStyleSheet.prototype.replaceSync = () => {};

/**
 * URL: canParse()
 */
if (new URL('http://example.com').canParse !== undefined) {
	throw new Error('`URL.canParse()` is supported for Jest');
}

URL.canParse = (url, base) => {
	try {
		new URL(url, base);
	} catch {
		return false;
	}
	return true;
};
