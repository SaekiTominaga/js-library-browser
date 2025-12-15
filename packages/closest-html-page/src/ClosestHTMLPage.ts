import MIMEType from 'whatwg-mimetype';
import { getParentPage } from './util/url.ts';

interface Option {
	maxFetchCount?: number; // If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞)
	fetchOptions?: RequestInit; // An object containing any custom settings that you want to apply to the reques
	mimeTypes?: DOMParserSupportedType[]; // MIME types of the HTML resource to retrieve
}

/**
 * Get the data of the HTML page of the nearest ancestor hierarchy
 */
export default class ClosestHTMLPage {
	readonly #maxFetchCount: number; // fetch() の最大試行回数

	readonly #fetchOptions: RequestInit | undefined; // fetch() 関数に指定するオプション

	readonly #mimeTypes: DOMParserSupportedType[]; // 取得するリソースの MIME タイプ

	readonly #fetchedResponses = new Set<Response>(); // fetch() した Response 情報

	/* もっとも近い祖先階層の HTML ページのデータ */
	#url: string | null = null; // URL

	#title: string | null = null; // タイトル

	/**
	 * @param options - Options for accessing web content
	 */
	constructor(options?: Readonly<Option>) {
		if (options?.maxFetchCount !== undefined) {
			if (!Number.isInteger(options.maxFetchCount)) {
				throw new TypeError('Argument `maxFetchCount` must be an integer.');
			}
			if (options.maxFetchCount < 0) {
				throw new RangeError('Argument `maxFetchCount` must be greater than or equal to 0.');
			}
		}
		this.#maxFetchCount = options?.maxFetchCount ?? 0;

		this.#fetchOptions = options?.fetchOptions;

		this.#mimeTypes = options?.mimeTypes ?? ['text/html', 'application/xhtml+xml'];
	}

	/**
	 * Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME types).
	 *
	 * @param baseUrl - Base URL
	 */
	async fetch(baseUrl: string = location.toString()): Promise<void> {
		const ancestorUrls: URL[] = [];
		while (ancestorUrls.at(-1)?.pathname !== '/') {
			ancestorUrls.push(getParentPage(ancestorUrls.at(-1) ?? new URL(baseUrl)));
		}

		const fetchUrls = this.#maxFetchCount > 0 ? ancestorUrls.slice(0, this.#maxFetchCount) : ancestorUrls;

		for (const url of fetchUrls) {
			const response = await fetch(`${url.origin}${url.pathname}`, this.#fetchOptions);

			this.#fetchedResponses.add(response);
			console.info(`【Fetch API】${response.url} [${[String(response.status), response.statusText].filter((s) => s !== '').join(' ')}]`);

			if (!response.ok) {
				continue;
			}

			const mimeType = response.headers.get('content-type');
			if (mimeType === null) {
				throw new Error(`Missing "Content-Type" in response header for URL <${response.url}>`);
			}

			/* MIME タイプからパラメーターを除去（e.g 'text/html; charset=utf-8' → 'text/html'） */
			const mimeTypeEssence = new MIMEType(mimeType).essence;

			if (!(this.#mimeTypes as string[]).includes(mimeTypeEssence)) {
				/* 指定された MIME タイプにマッチしない場合 */
				continue;
			}

			/* 諸条件を満たした場合 */
			this.#url = response.url;

			const doc = new DOMParser().parseFromString(await response.text(), mimeTypeEssence as DOMParserSupportedType);

			/* OGP からタイトルを取得し、指定されていない場合は <title> 要素から取得する */
			this.#title = doc.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content ?? doc.querySelector('title')?.textContent ?? null;

			break;
		}
	}

	/**
	 * Get the `Response` data resulting from the execution of `fetch()`.
	 *
	 * @returns `Response` datas
	 */
	get fetchedResponses(): Set<Response> {
		return this.#fetchedResponses;
	}

	/**
	 * Get the URL of the HTML page of the nearest ancestor hierarchy.
	 *
	 * @returns URL
	 */
	get url(): string | null {
		return this.#url;
	}

	/**
	 * Get the title of the HTML page of the nearest ancestor hierarchy.
	 *
	 * @returns Title
	 */
	get title(): string | null {
		return this.#title;
	}
}
