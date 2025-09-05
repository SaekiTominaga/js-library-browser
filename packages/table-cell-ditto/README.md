# Display table cells with ditto mark

[![npm version](https://badge.fury.io/js/%40w0s%2Ftable-cell-ditto.svg)](https://www.npmjs.com/package/@w0s/table-cell-ditto)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-table-cell-ditto.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-table-cell-ditto.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/table-cell-ditto/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/table-cell-ditto": "...",
      "text-metrics": "..."
    }
  }
</script>
<script type="module">
  import TableCellDitto from '@w0s/table-cell-ditto';

  for (const tableElement of document.querySelectorAll('.js-table-cell-ditto')) {
    const tableCellDitto = new TableCellDitto(tableElement, {
      mark: '"',
      th: true,
    });
    tableCellDitto.convert();
  }
</script>

<table class="js-table-cell-ditto">
  <thead>
    <tr>
      <th>header cell</th>
      <th>header cell</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>header cell</th>
      <td>data cell</td>
    </tr>
    <tr>
      <th>header cell</th>
      <td>data cell</td> <!-- This cell is replaced with an ditto mark -->
    </tr>
  </tbody>
</table>
```

### NG cases

Complex tables are not supported.

| NG case                                                                        | Code example                                                                      |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Horizontal joins by `colspan` attribute<br/>(`rowspan` attribute is supported) | `<td colspan="2">cell</td>`                                                       |
| Cells with `title` attribute<br/>(it will be overwritten by this function)     | `<td title="Cell title">cell</td>`                                                |
| Table with different font sizes for different cells                            | `<td style="font-size:16px">cell</td>`<br/>`<td style="font-size:20px">cell</td>` |
| Table with `<th>` element columns not uniformly positioned                     | `<tr><th></th><td></td><td></td></tr>`<br/>`<tr><th></th><th></th><td></td></tr>` |

## Constructor

```TypeScript
new TableCellDitto(
  thisElement: HTMLTableElement,
  options?: Option
)
```

### Parameters

<dl>
<dt><code>thisElement</code> [required]</dt>
<dd>Target element</dd>
<dt><code>options.mark</code> [optional]</dt>
<dd>Ditto mark (default: <code>"</code> )</dd>
<dt><code>options.th</code> [optional]</dt>
<dd>Whether <code>&lt;th&gt;</code> elements are to be converted or not (default: <code>false</code>)</dd>
</dl>

## Methods

<dl>
<dt><code>convert(): void</code></dt>
<dd>Replace with ditto mark</dd>
<dt><code>unConvert(): void</code></dt>
<dd>Stop replacing with ditto mark</dd>
</dl>
