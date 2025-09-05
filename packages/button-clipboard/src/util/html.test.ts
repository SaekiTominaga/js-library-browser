import { beforeEach, test, expect } from '@jest/globals';
import { getContent } from './html.ts';

beforeEach(() => {
	document.body.innerHTML = '';
});

test('<img>', () => {
	document.body.insertAdjacentHTML('beforeend', '<img src="xxx" alt="  content  ">');

	expect(getContent(document.querySelector('img')!)).toBe(`  content  `);
});

test('<textarea>', () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<textarea>
  content
  content
</textarea>
`,
	);

	expect(getContent(document.querySelector('textarea')!)).toBe(`  content
  content
`);
});

test('<meta>', () => {
	document.body.insertAdjacentHTML('beforeend', '<meta name="meta name" content="  content  ">');

	expect(getContent(document.querySelector('meta')!)).toBe('  content  ');
});

test('<meter>', () => {
	document.body.insertAdjacentHTML('beforeend', '<meter value="0.1">');

	expect(getContent(document.querySelector('meter')!)).toBe('0.1');
});

test('<pre>', () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<pre>
  content
  content
</pre>
`,
	);

	expect(getContent(document.querySelector('pre')!)).toBe(`  content
  content
`);
});

test('<p>', () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<p>
  content
  content
</p>
`,
	);

	expect(getContent(document.querySelector('p')!)).toBe(`content
  content`);
});
