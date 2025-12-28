/* CSSStyleSheet: replaceSync() <https://github.com/jsdom/jsdom/issues/3766> */
CSSStyleSheet.prototype.replaceSync = () => {};

/* ElementInternals <https://github.com/jsdom/jsdom/issues/3831> */
ElementInternals.prototype.setFormValue = () => {};
ElementInternals.prototype.states = {
	add: () => {},
	delete: () => true,
};

/* Popover <https://github.com/jsdom/jsdom/issues/3721> */
HTMLElement.prototype.hidePopover = () => {};
HTMLElement.prototype.showPopover = () => {};

/* HTMLDialogElement <https://github.com/jsdom/jsdom/issues/3294> */
HTMLDialogElement.prototype.close = () => {};
HTMLDialogElement.prototype.show = () => {};
HTMLDialogElement.prototype.showModal = () => {};

/* HTMLMediaElement <https://github.com/jsdom/jsdom/issues/1515> */
HTMLMediaElement.prototype.pause = () => {};
HTMLMediaElement.prototype.play = () => {};

/* ShadowRoot: adoptedStyleSheets <https://github.com/jsdom/jsdom/issues/3444> */
Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
	get() {
		return this._adoptedStyleSheets ?? [];
	},
	set(value) {
		this._adoptedStyleSheets = value;
	},
	configurable: true,
});

/* URL: canParse() */
URL.canParse = (url, base) => {
	try {
		new URL(url, base);
	} catch {
		return false;
	}
	return true;
};

/* window: confirm */
window.confirm = () => false;
