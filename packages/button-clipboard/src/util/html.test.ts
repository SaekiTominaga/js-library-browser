import { expect, test } from '@jest/globals';
import { getContent } from './html.ts';

test('<img>', () => {
	document.body.innerHTML = '<img src="xxx" alt="  content  ">';

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
	document.body.innerHTML = '<meta name="meta name" content="  content  ">';

	expect(getContent(document.querySelector('meta')!)).toBe('  content  ');
});

test('<meter>', () => {
	document.body.innerHTML = '<meter value="0.1">';

	expect(getContent(document.querySelector('meter')!)).toBe('0.1');
});

test('<pre>', () => {
	document.body.innerHTML = `
<pre>
  content
  content
</pre>
`;

	expect(getContent(document.querySelector('pre')!)).toBe(`  content
  content
`);
});

test('<p>', () => {
	document.body.innerHTML = `
<p>
  content
  content
</p>
`;

	expect(getContent(document.querySelector('p')!)).toBe(`content
  content`);
});
