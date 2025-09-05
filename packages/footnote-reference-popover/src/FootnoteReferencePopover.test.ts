import { describe, beforeAll, afterAll, afterEach, test, expect, jest } from '@jest/globals';
import CustomElementPopover from './custom-element/Popover.ts';
import FootnoteReferencePopover from './FootnoteReferencePopover.ts';

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

beforeAll(() => {
	CustomElementPopover.prototype.showPopover = jest.fn();
	CustomElementPopover.prototype.hidePopover = jest.fn();
}); // `jsdom` が `<dialog>` 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294

describe('click event', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('click', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-class="class"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector<HTMLAnchorElement>('.js-footnote-reference-popover')!;

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-class="class" role="button"></a>
<p id="footnote"></p>
<x-popover class="class" style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});
});

describe('trigger mouse event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover')!);
	});
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('mouseenter', () => {
		document.querySelector('.js-footnote-reference-popover')?.dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
`);
	});

	test('show', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});

	test('mouseleave', () => {
		document.querySelector('.js-footnote-reference-popover')?.dispatchEvent(new MouseEvent('mouseleave'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});

	test('hide', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});
});

describe('popover mouse event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover')!);
	});
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('show', async () => {
		document.querySelector('.js-footnote-reference-popover')?.dispatchEvent(new MouseEvent('mouseenter'));

		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});

	test('mouseenter', async () => {
		document.querySelector('.js-footnote-reference-popover')?.dispatchEvent(new MouseEvent('mouseleave'));

		document.querySelector('x-popover')?.dispatchEvent(new MouseEvent('mouseenter'));

		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});

	test('mouseleave', () => {
		document.querySelector('x-popover')?.dispatchEvent(new MouseEvent('mouseleave'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});

	test('hide', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button"></a>
<p id="footnote"></p>
<x-popover style="width: 0px; top: 0px; left: 0px;"></x-popover>`);
	});
});

describe('HTML - image preload', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('no link element', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-hide-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		const element = document.querySelector<HTMLAnchorElement>('.js-footnote-reference-popover')!;

		new FootnoteReferencePopover(element);
		element.dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.head.innerHTML).toBe('<link rel="preload" href="close.svg">'); // TODO: 本来は `as="image"` が付与される https://github.com/jsdom/jsdom/issues/3214
	});

	test('data url', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-hide-image-src="data:image/svg+xml,base64,..."></a>
<p id="footnote"></p>
`,
		);

		const element = document.querySelector<HTMLAnchorElement>('.js-footnote-reference-popover')!;

		new FootnoteReferencePopover(element);
		element.dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.head.innerHTML).toBe('');
	});

	test('link element already exists', () => {
		document.head.insertAdjacentHTML('beforeend', '<link/>');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-hide-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		const element = document.querySelector<HTMLAnchorElement>('.js-footnote-reference-popover')!;

		new FootnoteReferencePopover(element);
		element.dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.head.innerHTML).toBe('<link><link rel="preload" href="close.svg">'); // TODO: 本来は `as="image"` が付与される https://github.com/jsdom/jsdom/issues/3214
	});
});
