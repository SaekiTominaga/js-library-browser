# Automatically adjust the block size dimension of the `<textarea>` element to the input content

[![npm version](https://badge.fury.io/js/%40w0s%2Ftextarea-auto-size.svg)](https://www.npmjs.com/package/@w0s/textarea-auto-size)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/textarea-auto-size/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/textarea-auto-size": "...",
      "@w0s/writing-mode": "..."
    }
  }
</script>
<script type="module">
  import textareaAutoSize from '@w0s/textarea-auto-size';

  textareaAutoSize(document.querySelectorAll('.js-textarea-auto-size')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<textarea class="js-textarea-auto-size"></textarea>
```
