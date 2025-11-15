interface FetchParam {
	documentURL: string; // Field name when sending the URL of the document to an endpoint.
	message: string; // Field name when sending `ErrorEvent.message` to an endpoint.
	filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint.
	lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint.
	colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint.
}

export interface Option {
	fetchParam: Readonly<FetchParam>;
	fetchContentType?: 'application/x-www-form-urlencoded' | 'application/json';
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	denyFilenames?: readonly RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
	allowFilenames?: readonly RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
	denyUAs?: readonly RegExp[]; // If a user agent matches this regular expression, do not send report
	allowUAs?: readonly RegExp[]; // If a user agent matches this regular expression, send report
}

/**
 * Send script error information to endpoints
 */
export default class {
	readonly #endpoint: string; // URL of the endpoint

	readonly #options: Option; // Information such as transmission conditions

	/**
	 * @param endpoint - URL of the endpoint
	 * @param options - Information such as transmission conditions
	 */
	constructor(endpoint: string, options: Readonly<Option>) {
		this.#endpoint = endpoint;

		this.#options = options;

		if (!this.#checkUserAgent()) {
			return;
		}

		window.addEventListener('error', this.#errorEvent.bind(this), { passive: true });
	}

	/**
	 * ユーザーエージェントがレポートを行う対象かどうかチェックする
	 *
	 * @returns 対象なら true
	 */
	#checkUserAgent(): boolean {
		const ua = navigator.userAgent;

		const { denyUAs, allowUAs } = this.#options;
		if (denyUAs?.some((denyUA) => denyUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent match the deny list.');
			return false;
		}
		if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
			return false;
		}

		return true;
	}

	/**
	 * エラーイベント
	 *
	 * @param ev - ErrorEvent
	 */
	async #errorEvent(ev: ErrorEvent): Promise<void> {
		const { message, filename, lineno, colno } = ev;

		if (filename === '') {
			/* 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0） */
			console.error('`ErrorEvent.filename` is empty.');
			return;
		}

		const { denyFilenames, allowFilenames } = this.#options;
		if (denyFilenames?.some((denyFilename) => denyFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename match the deny list.');
			return;
		}
		if (allowFilenames !== undefined && !allowFilenames.some((allowFilename) => allowFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename does not match the allow list.');
			return;
		}

		switch (new URL(filename).protocol) {
			case 'https:':
			case 'http:':
				break;
			default:
				console.error('A JavaScript error has occurred in a non-HTTP protocol (This may be due to a browser extension).');
				return;
		}

		await this.#fetch(message, filename, lineno, colno);
	}

	/**
	 * レポートを送信
	 *
	 * @param message - ErrorEvent.message
	 * @param filename - ErrorEvent.filename
	 * @param lineno - ErrorEvent.lineno
	 * @param colno - ErrorEvent.colno
	 */
	async #fetch(message: string, filename: string, lineno: number, colno: number): Promise<void> {
		const { fetchParam, fetchContentType, fetchHeaders } = this.#options;

		const headers = new Headers(fetchHeaders);
		if (fetchContentType !== undefined) {
			headers.set('Content-Type', fetchContentType);
		}

		const bodyObject: Readonly<Record<string, string | number>> = {
			[fetchParam.documentURL]: location.toString(),
			[fetchParam.message]: message,
			[fetchParam.filename]: filename,
			[fetchParam.lineno]: lineno,
			[fetchParam.colno]: colno,
		};

		let body: BodyInit;
		if (fetchContentType === 'application/json') {
			body = JSON.stringify(bodyObject);
		} else {
			body = new URLSearchParams(Object.fromEntries(Object.entries(bodyObject).map(([key, value]) => [key, String(value)])));
		}

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: headers,
			body: body,
		});

		if (!response.ok) {
			throw new Error(`"${response.url}" is ${String(response.status)} ${response.statusText}`);
		}
	}
}
