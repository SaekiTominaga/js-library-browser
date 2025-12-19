if (ShadowRoot.adoptedStyleSheets) {
	throw new Error('`ShadowRoot.adoptedStyleSheets` is supported for Jest');
}

Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
	get() {
		return this._adoptedStyleSheets ?? [];
	},
	set(value) {
		this._adoptedStyleSheets = value;
	},
});

if (URL.canParse) {
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
