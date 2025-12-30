import MIMEType from 'whatwg-mimetype';
import { getAncestorUrls } from './util/url.ts';

interface Option {
	maxFetchCount?: number; // If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞)
	fetchOptions?: RequestInit; // An object containing any custom settings that you want to apply to the reques
	mimeTypes?: DOMParserSupportedType[]; // MIME types of the HTML resource to retrieve
}

interface HTMLPageData {
	url: string;
	title: string | undefined;
}

/**
 * Get the data of the HTML page of the nearest ancestor hierarchy
 *
 * @param baseUrl - Base URL
 * @param options - Options for accessing web content
 *
 * @returns Data from the web page fetched
 */
export default async (
	baseUrl: string = location.toString(),
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

	const fetchedResponses: Response[] = []; // fetch() した Response 情報
	const htmlPageData: HTMLPageData[] = [];

	for (const url of fetchUrls) {
		const response = await fetch(`${url.origin}${url.pathname}`, options?.fetchOptions);

		fetchedResponses.push(response);
		console.info(`【Fetch API】${response.url} [${[String(response.status), response.statusText].filter((s) => s !== '').join(' ')}]`);

		if (!response.ok) {
			continue;
		}

		const mimeType = response.headers.get('content-type');
		if (mimeType === null) {
			throw new Error(`Missing \`Content-Type\` in response header for URL <${response.url}>`);
		}

		/* MIME タイプからパラメーターを除去（e.g 'text/html; charset=utf-8' → 'text/html'） */
		const mimeTypeEssence = new MIMEType(mimeType).essence;

		if (!(options?.mimeTypes ?? (['text/html', 'application/xhtml+xml'] as string[])).includes(mimeTypeEssence)) {
			/* 指定された MIME タイプにマッチしない場合 */
			continue;
		}

		/* 諸条件を満たした場合 */
		const document = new DOMParser().parseFromString(await response.text(), mimeTypeEssence as DOMParserSupportedType);

		htmlPageData.push({
			url: response.url,
			title: document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content ?? document.querySelector('title')?.textContent ?? undefined,
		});

		break;
	}

	return {
		fetchedResponses: fetchedResponses,
		closestHTMLPageData: htmlPageData.at(-1),
	};
};
