# Footnote reference popover

[![npm version](https://badge.fury.io/js/%40w0s%2Ffootnote-reference-popover.svg)](https://www.npmjs.com/package/@w0s/footnote-reference-popover)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Features

- The overall behavior is similar to [Wikipedia footnotes](https://en.wikipedia.org/wiki/Help:Footnotes).
- Automatically copies the HTML of footnotes on the page and displays them as popovers.
  - Markup such as `<a href>` and `<code>` can be used in popovers. In other words, this is different from a tooltip.
- A popover is displayed on hovering or clicking the anchor element.
- Customizable delay time for showing and hiding for mouse operations.

## Browser support

Using the CSS anchor positioning. ([Can I use...](https://caniuse.com/css-anchor-positioning))

- Firefox 147+
- Safari 26.0+
- Chrome 125+
- Edge 125+

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/footnote-reference-popover/demo/)

## Examples

```html
<script type="importmap">
  {
    "imports": {
      "@w0s/footnote-reference-popover": "..."
    }
  }
</script>
<script type="module">
  import footnoteReferencePopover from '@w0s/footnote-reference-popover';

  footnoteReferencePopover('fn-ref'); // Specify the name of a custom element
</script>

<fn-ref>
  <a href="#fn-1" slot="anchor">[1]</a>
</fn-ref>

<fn-ref ignore=".backref" popover-delay-mouseenter="200ms" popover-delay-mouseleave="1s">
  <a href="#fn-2" id="fnref-2" slot="anchor">[Note2]</a>
  <template slot="popover__hide">
    <img src="popover-close.svg" alt="Close" width="18" height="18" />
  </template>
</fn-ref>

<p id="fn-1">Footnote1 text.</p>

<p id="fn-2">Footnote2 <a href="#">link</a> text. <a href="#fnref-2" class="backref">↩ Back</a></p>
```

## HTML attributes

<dl>
  <div>
    <dt><code>ignore</code> [optional]</dt>
    <dd>Selectors string for elements to ignore from the popover. For example, if a footnote contains a “Back” link, it should not be displayed in the popover.</dd>
  </div>
  <div>
    <dt><code>popover-delay-mouseenter</code> [optional]</dt>
    <dd>Delay time between mouse cursor moved within the anchor element and showing the popover. If omitted, the default value is '100ms'.</dd>
  </div>
  <div>
    <dt><code>popover-delay-mouseleave</code> [optional]</dt>
    <dd>Delay time between mouse cursor moved out of the anchor element or popover and closing the popover. If omitted, the default value is '500ms'.</dd>
  </div>
</dl>

## Slots in custom elements

<dl>
  <div>
    <dt><code>slot=anchor</code> [required]</dt>
    <dd>An anchor element that references a footnote.</dd>
  </div>
  <div>
    <dt><code>slot=popover__hide</code> [optional]</dt>
    <dd>A <code>&lt;template&gt;</code> element that contains elements representing the interior of the popover's close button. If omitted, it becomes a text labeled 'Close'.</dd>
  </div>
</dl>

## Style customization

The popover markup looks like this.

```html
<fn-ref>
  <a href="#fn" slot="anchor">[1]</a>
  <template slot="popover__hide">
    <img src="popover-close.svg" alt="Close" width="18" height="18" />
  </template>
</fn-ref>

↓

<fn-ref>
  #shadow-root (open)
  <sup><slot name="anchor" part="anchor"></slot></sup>
  <div popover="" id="popover" part="popover">
    <div part="popover__content">...</div>
    <button type="button" popovertarget="popover" popovertargetaction="hide" part="popover__hide">
      <img src="popover-close.svg" alt="Close" width="18" height="18" />
    </button>
  </div>
</fn-ref>
```

Therefore, you can customize the style using [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element.

```css
.my-fnref {
  &::part(anchor) {
    ...
  }

  &::part(popover) {
    ...
  }

  &::part(popover__content) {
    ...
  }

  &::part(popover__hide) {
    ...
  }
}
```
