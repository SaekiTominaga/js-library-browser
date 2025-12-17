import errorEvent from './event/error.ts';

export interface Option {
	fetch: Readonly<FetchOption>;
	validate?: Readonly<ValidateOption>;
}

export interface FetchOption {
	endpoint: string | URL; // URL of the endpoint
	param: Readonly<{
		documentURL: string; // Field name when sending the URL of the document to an endpoint
		message: string; // Field name when sending `ErrorEvent.message` to an endpoint
		filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint
		lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint
		colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint
	}>;
	contentType?: 'application/x-www-form-urlencoded' | 'application/json';
	headers?: HeadersInit; // Header to add to the `fetch()` request <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
}

export interface ValidateOption {
	/* User agent string */
	ua?: Readonly<{
		denys?: readonly RegExp[]; // If matches this regular expression, do not send report
		allows?: readonly RegExp[]; // If matches this regular expression, send report
	}>;
	/* `ErrorEvent.filename` */
	filename?: Readonly<{
		denys?: readonly RegExp[]; // If matches this regular expression, do not send report
		allows?: readonly RegExp[]; // If matches this regular expression, send report
	}>;
}

/**
 * Validation
 *
 * @param options - Options
 *
 * @returns If validation passes, it returns true
 */
const validate = (options?: Readonly<Pick<ValidateOption, 'ua'>>): boolean => {
	/* User agent */
	if (options?.ua !== undefined) {
		const ua = navigator.userAgent;
		const { denys, allows } = options.ua;

		if (denys?.some((deny) => deny.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent match the deny list.');
			return false;
		}
		if (allows !== undefined && !allows.some((allow) => allow.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
			return false;
		}
	}

	return true;
};

/**
 * Send script error information to endpoints
 *
 * @param options - Options
 */
export default (options: Readonly<Option>): void => {
	if (!validate(options.validate)) {
		return;
	}

	window.addEventListener(
		'error',
		async (ev: ErrorEvent) => {
			await errorEvent(ev, options);
		},
		{ passive: true },
	);
};
