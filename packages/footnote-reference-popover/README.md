# Footnote reference popover

[![npm version](https://badge.fury.io/js/%40w0s%2Ffootnote-reference-popover.svg)](https://www.npmjs.com/package/@w0s/footnote-reference-popover)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/footnote-reference-popover.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/footnote-reference-popover.yml)

## Features

- The overall behavior is similar to [Wikipedia footnotes](https://en.wikipedia.org/wiki/Help:Footnotes).
- Automatically copies the HTML of footnotes on the page and displays them as popovers.
  - Markup such as `<a href>` and `<code>` can be used in popovers.
  - However, `id` attributes inside footnote are removed. This is to prevent duplicate IDs from existing in the document.
- A popover is displayed on hovering or clicking the trigger element.
  - The popover is generated the first time a request is made to display the popover, not when the web page loads. This minimizes DOM processing at load time when a large number of popovers are embedded in the page.
- Customizable delay time for showing and hiding for mouse operations.

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/footnote-reference-popover/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/footnote-reference-popover": "...",
      "@w0s/shadow-append-css": "..."
    }
  }
</script>
<script type="module">
  import footnoteReferencePopover from '@w0s/footnote-reference-popover';

  footnoteReferencePopover(document.querySelectorAll('.js-footnote-reference-popover')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<a class="js-footnote-reference-popover"
  href="#footnote-1"
>[1]</a>

<a class="js-footnote-reference-popover"
  href="#footnote-2"
  data-popover-label="Note"
  data-popover-class="my-popover"
  data-popover-hide-text="Close"
  data-popover-hide-image-src="/assets/popover-close.svg"
  data-popover-hide-image-width="16"
  data-popover-hide-image-height="16"
  data-mouseenter-delay="250"
  data-mouseleave-delay="250"
>[1]</a>

<ul class="footnotes">
<li id="footnote-1">Footnote text. <a href="#">link</a> <code>code</code> <em>emphasis</em></li>
<li id="footnote-2">Footnote text.</li>
</ul>
```

## HTML attributes

<dl>
<dt><code>href</code> [required]</dt>
<dd>URL hash value of the element that contains the content to be displayed in the popover. (e.g. <code>#footnote-1</code> )</dd>
<dt><code>data-popover-label</code> [optional]</dt>
<dd>Label to be set on popover (<code>aria-label</code> attribute value).</dd>
<dt><code>data-popover-class</code> [optional]</dt>
<dd>Set the class name (<code>class</code> attribute value) on the popover element. It is mainly used to customize the appearance with CSS.</dd>
<dt><code>data-popover-hide-text</code> [optional]</dt>
<dd>The text of the close button in the popover. If omitted, the default value is 'Close'.</dd>
<dt><code>data-popover-hide-image-src</code> [optional]</dt>
<dd>The address of the image resource for the close button in the popover.</dd>
<dt><code>data-popover-hide-image-width</code> [optional]</dt>
<dd>The width of the image resource for the close button in the popover.</dd>
<dt><code>data-popover-hide-image-height</code> [optional]</dt>
<dd>The height of the image resource for the close button in the popover.</dd>
<dt><code>data-mouseenter-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved within the trigger element and showing the popover (milliseconds). If omitted, the default value is '250'.</dd>
<dt><code>data-mouseleave-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved out of the trigger element or popover and closing the popover (milliseconds). If omitted, the default value is '250'.</dd>
</dl>

## Style customization

The popover markup looks like this.

```html
<a class="js-footnote-reference-popover" href="#footnote" data-popover-class="my-popover">[1]</a>

<x-popover popover="" class="my-popover">
  #shadow-root (open)
  <span id="first-focusable" tabindex="0"></span>

  <div tabindex="-1" part="content">
    <slot>...</slot>

    <button type="button" popovertarget="" popovertargetaction="hide" part="hide-button">Close</button>
    or
    <button type="button" popovertarget="" popovertargetaction="hide" part="hide-button">
      <img src="close.svg" alt="Close" part="hide-button-image" />
    </button>
  </div>

  <span id="last-focusable" tabindex="0"></span>
</x-popover>
```

Therefore, you can customize the style using [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element.

```css
.my-popover::part(content) {
  &::part(content) {
    ...
  }

  &::part(hide-button) {
    ...
  }

  &::part(hide-button-image) {
    ...
  }
}
```
