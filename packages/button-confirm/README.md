# Display a `confirm()` modal dialog when button is pressed

[![npm version](https://badge.fury.io/js/%40w0s%2Fbutton-confirm.svg)](https://www.npmjs.com/package/@w0s/button-confirm)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/button-confirm/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-confirm": "..."
    }
  }
</script>
<script type="module">
  import buttonConfirm from '@w0s/button-confirm';

  buttonConfirm(document.querySelectorAll('.js-button-confirm')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<form>
  <p>
    <button class="js-button-confirm"
      data-message="Message text"
    >Submit</button>
  </p>
</form>
```

## HTML attributes

<dl>
<dt><code>data-message</code> [required]</dt>
<dd>A string you want to display in the <code>confirm()</code> modal dialog.</dd>
</dl>
