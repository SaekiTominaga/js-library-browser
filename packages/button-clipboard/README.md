# Clipboard write text button

[![npm version](https://badge.fury.io/js/%40w0s%2Fbutton-clipboard.svg)](https://www.npmjs.com/package/@w0s/button-clipboard)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/button-clipboard/demo/)

## Examples

```HTML
<script type="importmap">
	{
		"imports": {
			"@w0s/button-clipboard": "..."
		}
	}
</script>
<script type="module">
	import buttonClipboard from '@w0s/button-clipboard';

	buttonClipboard(document.querySelectorAll('.js-button-clipboard')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<button type="button" class="js-button-clipboard"
	data-text="Text"
>Copy</button>

<p id="clipboard-target">Text</p><!-- Target element -->
<button type="button" class="js-button-clipboard"
	data-target="clipboard-target"
	data-feedbacked-by="clipboard-feedback"
	data-feedback-text="✔ Copied to clipboard!"
	data-feedback-duration="3s"
>Copy</button>
<output id="clipboard-feedback"></output><!-- Feedback element -->
```

\* Target element: If the `data-target` attribute exists, write the contents of this element to the clipboard. Content is retrieved with `Node.textContent`, but some elements retrieve attribute values (e.g. `<img alt>`, `<input value>`). See [source code](https://github.com/SaekiTominaga/js-library-browser/blob/main/packages/button-clipboard/src/htmlContent.ts) for details.

\* Feedback element: It will be displayed when writing to the clipboard is done.

## HTML attributes

<dl>
	<div>
		<dt><code>type</code> [optional]</dt>
		<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
	</div>
	<div>
		<dt><code>data-text</code> [conditionally required]</dt>
		<dd>Text to write to clipboard. (Either the <code>data-target</code> attribute or this attribute is required)</dd>
	</div>
	<div>
		<dt><code>data-target</code> [conditionally required]</dt>
		<dd>Target element ID. (Either the <code>data-text</code> attribute or this attribute is required)</dd>
	</div>
	<div>
		<dt><code>data-feedbacked-by</code> [optional]</dt>
		<dd>Feedback element ID displayed when writing to the clipboard is done. This element must be a <code>&lt;output&gt;</code> element. If omitted, feedback will be displayed in <code>console</code>.</dd>
	</div>
	<div>
		<dt><code>data-feedback-text</code> [conditionally required]</dt>
		<dd>Text to displayed in the feedback. If the <code>data-feedbacked-by</code> attribute is specified, this attribute is required.</dd>
	</div>
	<div>
		<dt><code>data-feedback-duration</code> [optional]</dt>
		<dd>Specify the duration for displaying feedback using the <a href="https://www.w3.org/TR/css-values-3/#time">CSS Duration Units</a> format. If omitted, the feedback will not be hidden once it has been displayed.</dd>
	</div>
</dl>
