# Appending CSS into the shadow DOM

[![npm version](https://badge.fury.io/js/%40w0s%2Fshadow-append-css.svg)](https://www.npmjs.com/package/@w0s/shadow-append-css)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-shadow-append-css.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-shadow-append-css.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/shadow-append-css/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/shadow-append-css": "..."
    }
  }
</script>
<script type="module">
  import shadowAppendCss from '@w0s/shadow-append-css';

  class MyElement extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.setHTMLUnsafe('<slot></slot>');

      const cssString = `
        :host {
          display: block flow;
          align-content: center;
          background: #f00;
          block-size: 10em;
          inline-size: 10em;
          text-align: center;
          color: #000;
        }
      `;

      shadowAppendCss(shadow, cssString);
    }
  }

  customElements.define('my-element', MyElement);
</script>

<my-element>
  <p>text</p>
</my-element>
```
