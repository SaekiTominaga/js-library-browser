# Send script error information to endpoints

[![npm version](https://badge.fury.io/js/%40w0s%2Freport-js-error.svg)](https://www.npmjs.com/package/@w0s/report-js-error)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-report-js-error.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-report-js-error.yml)

Detects the `error` event of the `window` object and sends error information to the endpoint.

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/report-js-error/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/report-js-error": "..."
    }
  }
</script>
<script type="module">
  import reportJsError from '@w0s/report-js-error';

  reportJsError('https://report.example.com/js', {
    fetchParam: {
      documentURL: 'documentURL',
      message: 'message',
      filename: 'jsURL',
      lineno: 'lineNumber',
      colno: 'columnNumber',
    },
    fetchContentType: 'application/json',
    fetchHeaders: {
      'X-Requested-With': 'hoge',
    },
    allowFilenames: [
      /\.js$/,
      /\.mjs$/,
    ],
    denyUAs: [
      /Googlebot\/2.1;/,
    ],
  });
</script>
```

## Default function

```TypeScript
reportJsError(endpoint: string, options: Readonly<Option>): void
```

### Parameters

<dl>
<dt><code>endpoint</code> [required]</dt>
<dd>URL of the endpoint</dd>
<dt><code>options</code> [required]</dt>
<dd>Information such as transmission conditions</dd>
</dl>

### Option

```TypeScript
interface Option {
  fetchParam: {
    documentURL: string;
    message: string;
    filename: string;
    lineno: string;
    colno: string;
  },
  fetchContentType?: 'application/x-www-form-urlencoded' | 'application/json';
  fetchHeaders?: HeadersInit;
  denyFilenames?: RegExp[];
  allowFilenames?: RegExp[];
  denyUAs?: RegExp[];
  allowUAs?: RegExp[];
}
```

<dl>
<dt><code>fetchParam.documentURL</code></dt>
<dd>Field name when sending the URL of the document to an endpoint.</dd>
<dt><code>fetchParam.message</code></dt>
<dd>Field name when sending `ErrorEvent.message` to an endpoint.</dd>
<dt><code>fetchParam.filename</code></dt>
<dd>Field name when sending `ErrorEvent.filename` to an endpoint.</dd>
<dt><code>fetchParam.lineno</code></dt>
<dd>Field name when sending `ErrorEvent.lineno` to an endpoint.</dd>
<dt><code>fetchParam.colno</code></dt>
<dd>Field name when sending `ErrorEvent.colno` to an endpoint.</dd>
<dt><code>fetchContentType</code></dt>
<dd><code>Content-Type</code> header to be set in <code>fetch()</code> request.</dd>
<dt><code>fetchHeaders</code></dt>
<dd>Header to add to the <code>fetch()</code> request. Specify the <a href="https://fetch.spec.whatwg.org/#typedefdef-headersinit">HeadersInit</a> type.</dd>
<dt><code>denyFilenames</code></dt>
<dd>If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report.</dd>
<dt><code>allowFilenames</code></dt>
<dd>If the script filename (`ErrorEvent.filename`) matches this regular expression, send report. If neither <code>denyFilenames</code> nor <code>allowFilenames</code> is specified, any user agent will be accepted.</dd>
<dt><code>denyUAs</code></dt>
<dd>If a user agent matches this regular expression, do not send report.</dd>
<dt><code>allowUAs</code></dt>
<dd>If a user agent matches this regular expression, send report. If neither <code>denyUAs</code> nor <code>allowUAs</code> is specified, any file name will be accepted.</dd>
</dl>
