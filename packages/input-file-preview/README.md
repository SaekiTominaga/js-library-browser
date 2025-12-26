# Show preview with `<input type=file>`

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-file-preview.svg)](https://www.npmjs.com/package/@w0s/input-file-preview)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-file-preview.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-file-preview.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/input-file-preview/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-file-preview": "...",
      "@w0s/html-escape": "...",
      "whatwg-mimetype": "..."
    }
  }
</script>
<script type="module">
  import inputFilePreview from '@w0s/input-file-preview';

  inputFilePreview(document.querySelectorAll('.js-input-file-preview')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<input type="file" id="input-file" class="js-input-file-preview"
  data-preview="preview"
  data-max-size="1048576"
/>
<template id="preview">
  <output for="input-file"><code>${name}</code> (<data value="${size}">${size} byte</data>) cannot be previewed.</output>
</template>
```

## HTML attributes

<dl>
<dt><code>type</code> [required]</dt>
<dd>This attribute must include <code>file</code>.</dd>
<dt><code>data-preview</code> [required]</dt>
<dd>ID of the <code>&lt;template&gt;</code> element to display the preview.</dd>
<dt><code>data-max-size</code> [optional]</dt>
<dd>The number of bytes of maximum file size to preview (Files larger than this will not be previewed, but will not result in an error). If not specified, the default value is 10 MiB.</dd>
</dl>

## `<template>` element

- `<template>` element must have one `<output>` element.
  - 🆗 `<template> <output>Message</output> </template>`
  - 🆗 `<template> <output>Message</output> <!-- comment --> </template>`
  - 🆗 `<ul> <template> <li> <output>Message</output> </li> </template> </ul>`
  - 🆖 `<template> <output>Message</output> text </template>` (Text node other than empty string are not permitted as child nodes)
  - 🆖 `<template> <p>Message</p> </template>`
- Include the error message in the `<output>` element.
- `${name}` in the `<output>` element is converted to the file name, and `${size}` is converted to the file size (in bytes).
  - e.g. `<output><code>${name}</code> (<data value="${size}">${size} byte</data>) cannot be previewed.</output>`
