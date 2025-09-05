# Clipboard write text button

[![npm version](https://badge.fury.io/js/%40w0s%2Fbutton-clipboard.svg)](https://www.npmjs.com/package/@w0s/button-clipboard)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-button-clipboard.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-button-clipboard.yml)

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
  data-feedback="clipboard-feedback"
>Copy</button>
<p id="clipboard-feedback" hidden="">✔ Clipboard write successful!</p><!-- Feedback element -->
```

\* Target element: If the `data-target` attribute exists, write the contents of this element to the clipboard. Content is retrieved with `Node.textContent`, but some elements retrieve attribute values (e.g. `<img alt>`, `<input value>`). See [source code](https://github.com/SaekiTominaga/js-library-browser/blob/main/packages/button-clipboard/src/htmlContent.ts) for details.

\* Feedback element: It will be displayed when writing to the clipboard is done.

## HTML attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-text</code> [conditionally required]</dt>
<dd>Text to write to clipboard. (Either the <code>data-target</code> attribute or this attribute is required)</dd>
<dt><code>data-target</code> [conditionally required]</dt>
<dd>Target element ID. (Either the <code>data-text</code> attribute or this attribute is required)</dd>
<dt><code>data-feedback</code> [optional]</dt>
<dd>Feedback element ID displayed when writing to the clipboard is done. (If omitted, feedback will be displayed in <code>console</code>)</dd>
</dl>
