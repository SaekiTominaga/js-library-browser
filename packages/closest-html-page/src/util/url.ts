/**
 * Get the URL of parent page
 *
 * @param baseUrl - Base URL
 *
 * @returns Parent page URL
 */
export const getParentUrl = (baseUrl: URL): URL | undefined => {
	if (baseUrl.pathname === '/') {
		return undefined;
	}

	return new URL(baseUrl.pathname.endsWith('/') ? '../' : './', baseUrl);
};

/**
 * Get the URLs of all ancestor pages
 *
 * @param baseUrl - Base URL
 *
 * @returns All ancestor pages URL
 */
export const getAncestorUrls = (baseUrl: URL): URL[] => {
	const walk = (currentUrl: URL, accumulator: URL[] = []): URL[] => {
		const parentUrl = getParentUrl(currentUrl);
		if (parentUrl === undefined) {
			return accumulator;
		}
		return walk(parentUrl, [...accumulator, parentUrl]);
	};

	return walk(baseUrl);
};
