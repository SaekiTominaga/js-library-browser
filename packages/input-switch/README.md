# Implement something like `<input type=checkbox switch>`

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-switch.svg)](https://www.npmjs.com/package/@w0s/input-switch)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-switch.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-switch.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/input-switch/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-switch": "...",
      "@w0s/shadow-append-css": "..."
    }
  }
</script>
<script type="module">
  import InputSwitch from '@w0s/input-switch';

  customElements.define('x-input-switch', InputSwitch);
</script>

<label><x-input-switch
  name="foo"
  value="1"
  checked=""
  disabled=""
  storage-key="foo"
></x-input-switch> switch</label>
```

## HTML attributes

<dl>
<dt><code>name</code> [optional]</dt>
<dd>Name of the element to use for form submission. (Same as <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-name"><code>name</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>value</code> [optional]</dt>
<dd>Value of the form control. If omitted, the value is <code>on</code>. (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-value"><code>value</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>checked</code> [optional]</dt>
<dd>Whether the control is checked. (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-checked"><code>checked</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>disabled</code> [optional]</dt>
<dd>Whether the form control is disabled. (Same as <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled"><code>disabled</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>storage-key</code> [optional]</dt>
<dd>Save this value as <code>localStorage</code> key when switching controls. (value is <code>true</code> or <code>false</code> depending on the check state)</dd>
</dl>

## Style customization

The following CSS custom properties can be used to customize the style.

| name                         | deault              | Description                                                                                                                          |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--outline-offset`           | `1px`               | [`outline-offset`](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset) property value of switch control                 |
| `--block-size`               | `1em`               | Block size of switch control                                                                                                         |
| `--inline-size`              | `2em`               | Inline size of switch control                                                                                                        |
| `--animation-duration`       | `0.5s`              | Time a transition animation ([`transition-duration`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration) property) |
| `--track-color-on`           | `#2299ff`           | Track color when switch is on                                                                                                        |
| `--track-color-off`          | `#cccccc`           | Track color when switch is off                                                                                                       |
| `--track-color-disabled-on`  | `#666666`           | Track color when switch is on `disabled`                                                                                             |
| `--track-color-disabled-off` | `#666666`           | Track color when switch is off and `disabled`                                                                                        |
| `--thumb-radius`             | `calc(0.5em - 1px)` | Radius of slider ball                                                                                                                |
| `--thumb-color`              | `#ffffff`           | Color of slider ball                                                                                                                 |

The shadow DOM of the switch looks like this.

```html
<x-input-switch class="my-switch">
  #shadow-root (open)
  <div part="track"></div>
  <div part="thumb"></div>
</x-input-switch>
```

Therefore, the [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element may be used to customize the style as desired.

```css
.my-switch {
  --outline-offset: ...;
  --block-size: ...;
  ...

  &::part(track) {
    ...
  }

  &::part(thumb) {
    ...
  }
}
```

However, customizations other than CSS custom properties may be broken in future version updates.
