import type { Option, ValidateOption } from '../reportJsError.ts';

/**
 * Validation
 *
 * @param ev - ErrorEvent
 * @param options - Options
 *
 * @returns If validation passes, it returns true
 */
const validate = (ev: ErrorEvent, options?: Readonly<Pick<ValidateOption, 'filename'>>): boolean => {
	const { filename } = ev;

	/* filename */
	if (filename === '') {
		/* 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0） */
		console.error('`ErrorEvent.filename` is empty.');
		return false;
	}

	switch (new URL(filename).protocol) {
		case 'https:':
		case 'http:':
			break;
		default:
			console.error('A JavaScript error has occurred in a non-HTTP protocol (This may be due to a browser extension).');
			return false;
	}

	if (options?.filename !== undefined) {
		const { denys, allows } = options.filename;

		if (denys?.some((deny) => deny.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename match the deny list.');
			return false;
		}
		if (allows !== undefined && !allows.some((allow) => allow.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename does not match the allow list.');
			return false;
		}
	}

	return true;
};

/**
 * Submit the report
 *
 * @param ev - ErrorEvent
 * @param options - Options
 *
 * @returns Fetch result
 */
export default async (ev: ErrorEvent, options: Readonly<Option>): Promise<Response | undefined> => {
	if (!validate(ev, options.validate)) {
		return undefined;
	}

	const { message, filename, lineno, colno } = ev;
	const { endpoint, param, contentType, headers: headersInit } = options.fetch;

	const headers = new Headers(headersInit);
	if (contentType !== undefined) {
		headers.set('Content-Type', contentType);
	}

	const bodyObject: Readonly<Record<string, string | number>> = {
		[param.documentURL]: location.toString(),
		[param.message]: message,
		[param.filename]: filename,
		[param.lineno]: lineno,
		[param.colno]: colno,
	};

	let body: BodyInit;
	if (contentType === 'application/json') {
		body = JSON.stringify(bodyObject);
	} else {
		body = new URLSearchParams(Object.fromEntries(Object.entries(bodyObject).map(([key, value]) => [key, String(value)])));
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
