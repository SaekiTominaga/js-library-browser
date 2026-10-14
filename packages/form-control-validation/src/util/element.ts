const allowAlertRole = ($: Element): boolean => {
	const tagName = $.tagName.toLowerCase();

	/* Autonomous custom elements */
	if (tagName.includes('-')) {
		return true;
	}

	/* <a> element */
	if (tagName === 'a') {
		return !$.hasAttribute('href');
	}

	return [
		'abbr',
		'address',
		'b',
		'bdi',
		'bdo',
		'blockquote',
		'cite',
		'code',
		'data',
		'del',
		'dfn',
		'div',
		'em',
		'figure', // TODO: If the figure has a valid figcaption descendant: No role other than figure, which is NOT RECOMMENDED.
		'hgroup',
		'i',
		'ins',
		'kbd',
		'mark',
		'output',
		'p',
		'pre',
		'q',
		'rp',
		'rt',
		'ruby',
		's',
		'samp',
		'section',
		'small',
		'span',
		'strong',
		'sub',
		'sup',
		'time',
		'u',
		'var',
	].includes(tagName);
};

export { allowAlertRole };
