/**
 * Popover <https://github.com/jsdom/jsdom/issues/3721>
 */
HTMLElement.prototype.hidePopover = () => {};
HTMLElement.prototype.showPopover = () => {};

/**
 * HTMLMediaElement <https://github.com/jsdom/jsdom/issues/1515>
 */
HTMLMediaElement.prototype.pause = () => {};
HTMLMediaElement.prototype.play = () => {};

/**
 * ShadowRoot: adoptedStyleSheets <https://github.com/jsdom/jsdom/issues/3444>
 */
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
CSSStyleSheet.prototype.replaceSync = () => {};

/**
 * URL: canParse()
 */
URL.canParse = (url, base) => {
	try {
		new URL(url, base);
	} catch {
		return false;
	}
	return true;
};
