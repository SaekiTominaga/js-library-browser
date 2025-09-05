# Tabs UI component

[![npm version](https://badge.fury.io/js/%40w0s%2Ftab.svg)](https://www.npmjs.com/package/@w0s/tab)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-tab.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-tab.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/tab/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/tab": "...",
      "@w0s/shadow-append-css": "..."
    }
  }
</script>
<script type="module">
  import Tab from '@w0s/tab';

  customElements.define('x-tab', Tab);
</script>

<x-tab
  tablist-label="Tab label"
  storage-key="tab1"
>
  <a href="#tabpanel1" slot="tab">Tab 1</a>
  <a href="#tabpanel2" slot="tab">Tab 2</a>
  <div slot="tabpanel" id="tabpanel1">Contents of tabpanel 1</div>
  <div slot="tabpanel" id="tabpanel2">Contents of tabpanel 2</div>
</x-tab>
```

\* **`uuid` is no longer required since version 3.1**

## HTML attributes

<dl>
<dt><code>tablist-label</code> [optional]</dt>
<dd>Label string to set in <code>[role=tablist]</code>. (set as the <code>aria-label</code> attribute value)</dd>
<dt><code>storage-key</code> [optional]</dt>
<dd>When a tab is selected, its value is saved as the <code>sessionStorage</code>. The selected tab is maintained when you navigate or reload the page. <strong>This value should be unique within your site because it is used as the key for <code>sessionStorage</code>.</strong> (Setting this attribute is optional, but it is recommended to set it from the viewpoint of usability.)</dd>
</dl>

## Style customization

### Shadow DOM

The tab markup looks like this.

```html
<x-tab class="my-tab">
  #shadow-root (open)
  <div part="tablist" role="tablist">
    <slot name="tab"></slot>
  </div>
  <div part="tabpanels">
    <slot name="tabpanel"></slot>
  </div>
</x-tab>
```

Therefore, you can customize the style using [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element.

```css
.my-tab {
  &::part(tab) {
    ...
  }

  &::part(tabpanels) {
    ...
  }
}
```

### `slot="tab"`, `slot="tabpanel"`

Elements using the `slot` attribute will have the following attributes added by applying the custom element.

```html
<x-tab class="my-tab">
  <a href="#tabpanel1" slot="tab">Tab 1</a>
  <a href="#tabpanel2" slot="tab">Tab 2</a>

  <div slot="tabpanel" id="tabpanel1">Contents of tabpanel 1</div>
  <div slot="tabpanel" id="tabpanel2">Contents of tabpanel 2</div>
</x-tab>
```

↓

```html
<x-tab class="my-tab">
  <a slot="tab" id="..." role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true">Tab 1</a>
  <a slot="tab" id="..." role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false">Tab 2</a>

  <div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="...">Contents of tabpanel 1</div>
  <div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="..." class="is-hidden">Contents of tabpanel 2</div>
</x-tab>
```

Therefore, you can customize the style using `role` attribute.

```css
.my-tab {
  & > [role='tab'] {
    ...
    /* This style does not applicable in environments where JavaScript is disabled */
  }

  & > [role='tabpanel'] {
    ...
    /* This style does not applicable in environments where JavaScript is disabled */
  }
}
```
