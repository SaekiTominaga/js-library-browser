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
