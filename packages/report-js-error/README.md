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

  reportJsError({
    fetch: {
      endpoint: new URL('https://report.example.com/js'),
      param: {
        documentURL: 'documentURL',
        message: 'message',
        filename: 'jsURL',
        lineno: 'lineNumber',
        colno: 'columnNumber',
      },
      contentType: 'application/json',
      headers: {
        'X-Requested-With': 'foo',
      },
    },
    validate: {
      {
        ua: {
          denys: [/Googlebot\/2.1;/v],
        },
        filename: {
          allows: [/\.js$/v, /\.mjs$/v],
        },
      },
    },
  });
</script>
```

## Default function

```TypeScript
reportJsError(options: Readonly<Option>): void
```

### Option

```TypeScript
interface Option {
  fetch: Readonly<FetchOption>;
  validate?: Readonly<ValidateOption>;
}

interface FetchOption {
  endpoint: string | URL; // URL of the endpoint
  param: Readonly<{
    documentURL: string; // Field name when sending the URL of the document to an endpoint
    message: string; // Field name when sending `ErrorEvent.message` to an endpoint
    filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint
    lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint
    colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint
  }>;
  contentType?: 'application/x-www-form-urlencoded' | 'application/json';
  headers?: HeadersInit; // Header to add to the `fetch()` request <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
}

interface ValidateOption {
  /* User agent string */
  ua?: Readonly<{
    denys?: readonly RegExp[]; // If matches this regular expression, do not send report
    allows?: readonly RegExp[]; // If matches this regular expression, send report
  }>;
  /* `ErrorEvent.filename` */
  filename?: Readonly<{
    denys?: readonly RegExp[]; // If matches this regular expression, do not send report
    allows?: readonly RegExp[]; // If matches this regular expression, send report
  }>;
}
```
