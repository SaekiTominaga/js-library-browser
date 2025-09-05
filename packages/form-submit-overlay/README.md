# Cover the entire screen with an overlay when form submitting

[![npm version](https://badge.fury.io/js/%40w0s%2Fform-submit-overlay.svg)](https://www.npmjs.com/package/@w0s/form-submit-overlay)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-form-submit-overlay.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-form-submit-overlay.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/form-submit-overlay/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/form-submit-overlay": "..."
    }
  }
</script>
<script type="module">
  import formSubmitOverlay from '@w0s/form-submit-overlay';

  formSubmitOverlay(document.querySelectorAll('.js-form-submit-overlay')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<form class="js-form-submit-overlay"
  data-overlayed-by="form-submit-overlay"
>
</form>

<dialog id="form-submit-overlay" aria-labelledby="form-submit-overlay-message" aria-describedby="form-submit-overlay-message">
  <p id="form-submit-overlay-message">Loading...</p>
</dialog>
```

## HTML Attributes

<dl>
<dt><code>data-overlayed-by</code> [required]</dt>
<dd>ID of the overlay (<code>&lt;dialog&gt;</code> element) to be displayed when form submitting</dd>
</dl>
