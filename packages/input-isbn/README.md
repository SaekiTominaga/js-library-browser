# ISBN input field

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-isbn.svg)](https://www.npmjs.com/package/@w0s/input-isbn)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-isbn.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-isbn.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/input-isbn/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-isbn": "...",
      "@w0s/isbn-verify": "..."
    }
  }
</script>
<script type="module">
  import inputIsbn from '@w0s/input-isbn';

  inputIsbn(document.querySelectorAll('.js-input-isbn')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<input class="js-input-isbn"
  data-validation-message-isbn-checkdigit="ISBN check digit is invalid."
/>
```

## HTML attributes

<dl>
<dt><code>data-validation-message-isbn-checkdigit</code> [required]</dt>
<dd>Error message when check digit does not match.</dd>
</dl>
