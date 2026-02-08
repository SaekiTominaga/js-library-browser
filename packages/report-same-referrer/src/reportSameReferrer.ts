type URLPart = 'origin' | 'host' | 'hostname';

export interface Option {
	fetch: Readonly<FetchOption>;
	validate?: Readonly<ValidateOption>;
}

export interface FetchOption {
	endpoint: string | URL; // URL of the endpoint
	param: Readonly<{
		documentURL: string; // Field name when sending the URL of the document to an endpoint
		referrer: string; // Field name when sending `document.referrer` to an endpoint
	}>;
	contentType?: 'application/x-www-form-urlencoded' | 'application/json'; // `Content-Type` header to be set in `fetch()` request
	headers?: HeadersInit; // Header to add to the `fetch()` request <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
}

export interface ValidateOption {
	/* Referrer */
	referrer?: Readonly<{
		comparePart?: URLPart; // Which parts of the referrer to check (default: `origin`)
		sames?: readonly string[]; // Domain information treated as the same site
	}>;

	/* User agent string */
	ua?: Readonly<{
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
const validate = (options?: Readonly<ValidateOption>): boolean => {
	/* Referrer */
	const { referrer } = document;
	if (referrer === '') {
		return false;
	}

	const referrerUrl = new URL(referrer);

	const getUrlPart = (part: URLPart | undefined): { referrer: string; location: string } => {
		switch (part) {
			case undefined:
			case 'origin': {
				return { referrer: referrerUrl.origin, location: location.origin };
			}
			case 'host': {
				return { referrer: referrerUrl.host, location: location.host };
			}
			case 'hostname': {
				return { referrer: referrerUrl.hostname, location: location.hostname };
			}
			default:
				throw new Error('An invalid value was specified for the argument `condition`.');
		}
	};

	const { referrer: referrerPart, location: locationPart } = getUrlPart(options?.referrer?.comparePart);

	if (referrerPart !== locationPart && !options?.referrer?.sames?.includes(referrerPart)) {
		return false;
	}

	/* User agent */
	if (options?.ua !== undefined) {
		const ua = navigator.userAgent;
		const { denys, allows } = options.ua;

		if (denys?.some((deny) => deny.test(ua))) {
			console.info('No referrer error report will be sent because the user agent match the deny list.');
			return false;
		}
		if (allows !== undefined && !allows.some((allow) => allow.test(ua))) {
			console.info('No referrer error report will be sent because the user agent does not match the allow list.');
			return false;
		}
	}

	return true;
};

/**
 * Send referrer error information to endpoints
 *
 * @param options - Options
 *
 * @returns Fetch result
 */
export default async (options: Readonly<Option>): Promise<Response | undefined> => {
	if (!validate(options.validate)) {
		return undefined;
	}

	const { endpoint, param, contentType, headers: headersInit } = options.fetch;

	const headers = new Headers(headersInit);
	if (contentType !== undefined) {
		headers.set('Content-Type', contentType);
	}

	const bodyObject: Readonly<Record<string, string>> = {
		[param.documentURL]: location.toString(),
		[param.referrer]: document.referrer,
	};

	let body: BodyInit;
	if (contentType === 'application/json') {
		body = JSON.stringify(bodyObject);
	} else {
		body = new URLSearchParams(bodyObject);
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: headers,
		body: body,
	});

	if (!response.ok) {
		throw new Error(`\`${response.url}\` is ${String(response.status)} ${response.statusText}`);
	}

	return response;
};
