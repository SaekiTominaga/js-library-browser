# Get the CSS `writing-mode` status of the element

[![npm version](https://badge.fury.io/js/%40w0s%2Fwriting-mode.svg)](https://www.npmjs.com/package/@w0s/writing-mode)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-writing-mode.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-writing-mode.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/writing-mode/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/writing-mode": "..."
    }
  }
</script>
<script type="module">
  import WritingMode from '@w0s/writing-mode';

  const writingMode = new WritingMode(document.querySelector('p'));

  const value = writingMode.value; // 'vertical-rl'
  const horizontal = writingMode.isHorizontal(); // false
  const vertical = writingMode.isVertical(); // true
</script>

<p style="writing-mode: vertical-rl">text</p>
```

## Constructor

```TypeScript
new WritingMode(
  element: HTMLElement
)
```

### Parameters

<dl>
<dt><code>element</code> [required]</dt>
<dd>Target element</dd>
</dl>

## Methods

<dl>
<dt><code>get value(): 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr'</code></dt>
<dd>Get the value of <code>writing-mode</code></dd>
<dt><code>isHorizontal(): boolean</code></dt>
<dd>Whether the element is horizontal or not</dd>
<dt><code>isVertical(): boolean</code></dt>
<dd>Whether the element is vertical or not</dd>
</dl>
