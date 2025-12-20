# Animating the `<details>` element

[![npm version](https://badge.fury.io/js/%40w0s%2Fdetails-animation.svg)](https://www.npmjs.com/package/@w0s/details-animation)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-details-animation.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-details-animation.yml)

## Features

- Animation effect on the opening and closing of HTML `<details>` element.
- Animation speed (`duration`) and easing effects (`easing`) can be customized.
- In [`prefers-reduced-motion: reduce`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) environments, no animation is performed. (Version 4.2.0 or later)

## Browser support

Using the ShadowRoot: `adoptedStyleSheets`. ([Can I use...](https://caniuse.com/mdn-api_shadowroot_adoptedstylesheets))

- Firefox 101+
- Safari 16.4+
- Chrome 73+
- Edge 79+

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/details-animation/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/details-animation": "...",
      "@w0s/writing-mode": "..."
    }
  }
</script>
<script type="module">
  import detailsAnimation from '@w0s/details-animation';

  detailsAnimation(document.querySelectorAll('.js-details-animation')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<details class="js-details-animation"
  open=""
  data-duration="1000"
  data-easing="linear"
>
  <summary>Caption Text</summary>
  <p>Contents text</p>
</details>
```

\* **`@w0s/shadow-append-css` is no longer required since version 7.0**

## HTML attributes

<dl>
<dt><code>open</code> [optional]</dt>
<dd>Whether the details are visible. (<a href="https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-open">open attribute of <code>&lt;details&gt;</code> Element</a>)</dd>
<dt><code>data-duration</code> [optional]</dt>
<dd>The iteration duration which is a real number greater than or equal to zero (including positive infinity) representing the time taken to complete a single iteration of the animation effect (See <a href="https://www.w3.org/TR/web-animations-1/#dictdef-optionaleffecttiming"><code>OptionalEffectTiming</code></a> for details). If omitted, the default value is <code>500</code>(ms).</dd>
<dt><code>data-easing</code> [optional]</dt>
<dd>The timing function used to scale the time to produce easing effects (See <a href="https://www.w3.org/TR/web-animations-1/#dictdef-optionaleffecttiming"><code>OptionalEffectTiming</code></a> for details). If omitted, the default value is <code>ease</code>.</dd>
</dl>

## Sample CSS

In order to achieve animation, the timing of setting the `open` attribute of the `<details>` element is delayed. Therefore, the viewlet icon of the `<summary>` element should be determined by the `data-pre-open` attribute.

```css
details {
  --summary-icon-rotate: 0deg;

  &:is(:not([open]), [data-pre-open='false']) {
    --summary-icon-rotate: -90deg;
  }

  & > summary {
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      display: inline flow-root;
      margin-inline-end: 0.5em;
      content: '▼';
      rotate: var(--summary-icon-rotate);
    }
  }
}
```

\* By including both `:not([open])` and `[data-pre-open='false']` in the selector's condition, we can handle both cases when JavaScript works correctly and when it does not (e.g. script disabled environment).

\* Safari(26) does not support `list-style` for the `<summary>` element, so use the `::-webkit-details-marker` pseudo-element. ([Can I use...](https://caniuse.com/mdn-html_elements_summary_display_list_item))
