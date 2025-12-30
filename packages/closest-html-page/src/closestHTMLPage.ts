import MIMEType from 'whatwg-mimetype';
import { getAncestorUrls } from './util/url.ts';

interface Option {
	maxFetchCount?: number; // If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞)
	fetchOptions?: RequestInit; // An object containing any custom settings that you want to apply to the reques
	mimeTypes?: readonly DOMParserSupportedType[]; // MIME types of the HTML resource to retrieve
}

interface HTMLPageData {
	url: string;
	title: string | undefined;
}

/**
 * Fetch HTML content
 *
 * @param url - URL
 * @param options - Options for accessing web content
 *
 * @returns Data from the web content fetched
 */
export const fetchProcess = async (
	url: URL,
	options?: Readonly<Option>,
): Promise<{
	response: Response;
	htmlPage?: boolean;
	title?: string | undefined;
}> => {
	const response = await fetch(`${url.origin}${url.pathname}`, options?.fetchOptions);

	console.info(`【Fetch API】${response.url} [${[String(response.status), response.statusText].filter((s) => s !== '').join(' ')}]`);

	if (!response.ok) {
		return {
			response: response,
		};
	}

	const mimeType = response.headers.get('content-type');
	if (mimeType === null) {
		throw new Error(`Missing \`Content-Type\` in response header for URL <${response.url}>.`);
	}

	/* MIME タイプからパラメーターを除去（e.g 'text/html; charset=utf-8' → 'text/html'） */
	const mimeTypeEssence = new MIMEType(mimeType).essence;

	if (!(options?.mimeTypes ?? (['text/html', 'application/xhtml+xml'] as readonly string[])).includes(mimeTypeEssence)) {
		/* 指定された MIME タイプにマッチしない場合 */
		return {
			response: response,
			htmlPage: false,
		};
	}

	/* 諸条件を満たした場合 */
	const document = new DOMParser().parseFromString(await response.text(), mimeTypeEssence as DOMParserSupportedType);

	return {
		response: response,
		htmlPage: true,
		title: document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content ?? document.querySelector('title')?.textContent ?? undefined,
	};
};

/**
 * Get the data of the HTML page of the nearest ancestor hierarchy
 *
 * @param baseUrl - Base URL
 * @param options - Options for accessing web content
 *
 * @returns Data from the web page fetched
 */
export default async (
	baseUrl = location.toString(),
	options?: Readonly<Option>,
): Promise<{
	fetchedResponses: Response[];
	closestHTMLPageData: HTMLPageData | undefined;
}> => {
	/* Options validate */
	if (options?.maxFetchCount !== undefined) {
		if (!Number.isInteger(options.maxFetchCount)) {
			throw new TypeError('Argument `maxFetchCount` must be an integer.');
		}
		if (options.maxFetchCount < 0) {
			throw new RangeError('Argument `maxFetchCount` must be greater than or equal to 0.');
		}
	}

	const ancestorUrls: readonly URL[] = getAncestorUrls(new URL(baseUrl));

	const fetchUrls = options?.maxFetchCount !== undefined && options.maxFetchCount > 0 ? ancestorUrls.slice(0, options.maxFetchCount) : ancestorUrls;

	const fetchedResponses: Response[] = []; // `fetch()` した Response 情報

	const getHtmlPageData = async (index = 0): Promise<HTMLPageData | undefined> => {
		const fetchUrl = fetchUrls.at(index);
		if (fetchUrl === undefined) {
			return undefined;
		}

		const { response, htmlPage, title } = await fetchProcess(fetchUrl, options);

		fetchedResponses.push(response);

		if (htmlPage) {
			return {
				url: response.url,
				title: title,
			};
		}

		return await getHtmlPageData(index + 1);
	};
	const htmlPageData = await getHtmlPageData();

	return {
		fetchedResponses: fetchedResponses,
		closestHTMLPageData: htmlPageData,
	};
};
