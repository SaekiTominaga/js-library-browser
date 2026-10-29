# Tabs UI component

[![npm version](https://badge.fury.io/js/%40w0s%2Ftab.svg)](https://www.npmjs.com/package/@w0s/tab)
[![CI status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/ci.yml)

## Features

- Keyboard navigation complies with the [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) in the <cite>ARIA Authoring Practices Guide (APG)</cite>.
  - Pressing the <kbd>Left Arrow</kbd> / <kbd>Right Arrow</kbd> key Automatically activates the newly focused tab.
  - It also supports the <kbd>Home</kbd> and <kbd>End</kbd> keys.
  - Since popup menu within tabs is not supported, the <kbd>Shift</kbd> + <kbd>F10</kbd> key is not recognized.
  - Since deletion tabs is not supported, the <kbd>Delete</kbd> key is not recognized.
- Focusgroup is used for navigation within the tablist using the arrow keys.
  - Continue tto provide support for browsers that do not support focusgroup.
- Vertical tabs are not supported.

## Browser support

Using the `ariaControlsElements` property. ([Can I use...](https://caniuse.com/mdn-api_element_ariacontrolselements))

- Firefox 136+
- Safari 16.4+
- Chrome 135+
- Edge 135+

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/tab/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/tab": "..."
    }
  }
</script>
<script type="module">
  import tab from '@w0s/tab';

  tab('my-tab'); // Specify the name of a custom element
</script>

<my-tab
  tablist-label="Tab label"
  tabpanel-focus="true"
  storage-key="tab1"
>
  <a href="#tabpanel1" slot="tab">Tab 1</a>
  <a href="#tabpanel2" slot="tab">Tab 2</a>
  <div slot="tabpanel" id="tabpanel1">Contents of tabpanel 1</div>
  <div slot="tabpanel" id="tabpanel2">Contents of tabpanel 2</div>
</my-tab>
```

## HTML attributes

<dl>
  <div>
    <dt><code>tablist-label</code> [optional]</dt>
    <dd>Label string to set in <code>[role=tablist]</code>. (set as the <code>aria-label</code> attribute value)</dd>
  </div>
  <div>
    <dt><code>tabpanel-focus</code> [optional]</dt>
    <dd>If the first element containing meaningful content inside the tabpanel is focusable, setting this attribute to <code>false</code> prevents the tabpanel itself from receiving focus. You can test the behavior on the demo page by pressing the <kbd>Tab</kbd> key while the focus is on a tab element.</dd>
  </div>
  <div>
    <dt><code>storage-key</code> [optional]</dt>
    <dd>When a tab is selected, its value is saved as the <code>sessionStorage</code>. The selected tab is maintained when you navigate or reload the page. <strong>This value should be unique within your site because it is used as the key for <code>sessionStorage</code>.</strong> (Setting this attribute is optional, but it is recommended to set it from the viewpoint of usability.)</dd>
  </div>
</dl>

## Style customization

The tab markup looks like this.

```html
<my-tab>
  #shadow-root (open)
  <div focusgroup="tablist" part="tablist">
    <slot name="tab"></slot>
  </div>
  <div part="tabpanels">
    <slot name="tabpanel"></slot>
  </div>
</my-tab>
```

Therefore, you can customize the style using [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element.

```css
my-tab {
  &::part(tablist) {
    ...
  }

  &::part(tabpanels) {
    ...
  }
}
```
