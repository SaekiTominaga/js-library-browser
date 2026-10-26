/**
 * Retrieve the footnote element linked to the anchor element
 *
 * @param $anchor - Anchor element
 * @param option - Option
 * @param option.ignoreSelectors - Selectors for elements to ignore
 *
 * @returns Footnote element
 */
const getFootnote = (
	$anchor: HTMLElement | null,
	option?: Readonly<{
		ignoreSelectors?: string | undefined;
	}>,
): HTMLElement => {
	if ($anchor === null) {
		throw new Error('Anchor element not found');
	}

	if (!($anchor instanceof HTMLAnchorElement)) {
		throw new TypeError('The element must be a `<a>` element');
	}

	if ($anchor.href === '') {
		throw new TypeError('The `href` attribute is not set');
	}

	if ($anchor.origin !== location.origin || $anchor.pathname !== location.pathname) {
		throw new TypeError('The `href` attribute must be in the same content');
	}

	const id = $anchor.hash.slice(1);
	const $footnote = document.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
	if ($footnote === null) {
		throw new Error(`Element \`#${id}\` not found`);
	}

	const $footnoteClone = $footnote.cloneNode(true) as HTMLElement;

	/* 除外要素 */
	if (option?.ignoreSelectors !== undefined) {
		$footnoteClone.querySelectorAll(option.ignoreSelectors).forEach(($ignore) => {
			$ignore.remove();
		});
	}

	return $footnoteClone;
};

export { getFootnote };
