# Implement something like `<input type=checkbox switch>`

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-switch.svg)](https://www.npmjs.com/package/@w0s/input-switch)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Browser support

Using the `CustomStateSet`. ([Can I use...](https://caniuse.com/mdn-api_customstateset))

- Firefox 126+
- Safari 17.4+
- Chrome 90+
- Edge 90+

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/input-switch/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-switch": "..."
    }
  }
</script>
<script type="module">
  import inputSwitch from '@w0s/input-switch';

  inputSwitch('input-switch'); // Specify the name of a custom element
</script>

<label><input-switch
  name="foo"
  value="1"
  checked=""
  disabled=""
  storage-key="foo"
></input-switch> switch</label>
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

The following CSS custom properties can be used to customize the style. The default values for each are similar to the user agent style for `<input type=checkbox switch>` in Safari.

| name                   | Default value                         | Description                                                                                                                                |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `--block-size`         | `1.9em`                               | Block size of switch control                                                                                                               |
| `--inline-size`        | `calc(var(--block-size) * 2.3)`       | Inline size of switch control                                                                                                              |
| `--animation-duration` | `0.25s`                               | Time a transition animation ([`transition-duration`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration) property value) |
| `--disabled-opacity`   | `0.5`                                 | Opacity when switch is disabled ([`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/                                             | `--disabled-opacity` | `0.5` | Opacity when switch is disabled ([`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) property value) |
| `--track-color-on`     | `oklch(73.03% 0.1944 147.44deg)`      | Track color when switch is on                                                                                                              |
| `--track-color-off`    | `oklch(82.09% 0.0028 286.34deg)`      | Track color when switch is off                                                                                                             |
| `--thumb-block-size`   | `calc(var(--block-size) - 4px)`       | Block size of thumb ball                                                                                                                   |
| `--thumb-inline-size`  | `calc(var(--thumb-block-size) * 1.5)` | Inline size of thumb ball                                                                                                                  |
| `--thumb-color`        | `oklch(100% 0 0deg)`                  | Color of thumb ball                                                                                                                        |

The shadow DOM of the switch looks like this.

```html
<input-switch>
  #shadow-root (open)
  <div part="track"><span part="thumb"></span></div>
</input-switch>
```

Therefore, the [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element may be used to more granular customize.

```css
input-switch {
  --block-size: ...;
  --inline-size: ...;
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
