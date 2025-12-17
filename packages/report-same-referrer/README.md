# Send referrer error information to endpoints

[![npm version](https://badge.fury.io/js/%40w0s%2Freport-same-referrer.svg)](https://www.npmjs.com/package/@w0s/report-same-referrer)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-report-same-referrer.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-report-same-referrer.yml)

If there are referrers from same site, that information will be sent to the endpoint as an error.

As a practical use case, this script put this script in error pages like 403, 404, 410 error pages to detect **the existence of broken links in the same site**.

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/report-same-referrer/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/report-same-referrer": "..."
    }
  }
</script>
<script type="module">
  import reportSameReferrer from '@w0s/report-same-referrer';

  await reportSameReferrer({
    fetch: {
      endpoint: 'https://report.example.com/referrer',
      param: {
        documentURL: 'documentURL',
        referrer: 'referrer',
      },
      contentType: 'application/json',
      headers: {
        'X-Requested-With': 'foo',
      },
    },
    validate: {
      referrer: {
        comparePart: 'origin',
        sames: [
          'https://www1.example.com',
          'https://www2.example.com',
        ],
      },
      ua: { denys: [/Googlebot\/2.1;/v] },
    },
  });
</script>
```

## Default function

```TypeScript
async (options: Readonly<Option>): Promise<Response | undefined>
```

### Option

```TypeScript
export interface Option {
  fetch: Readonly<FetchOption>;
  validate?: Readonly<ValidateOption>;
}

export interface FetchOption {
  endpoint: string | URL; // URL of the endpoint
  param: Readonly<{
    documentURL: string; // Field name when sending the URL of the document to an endpoint
    referrer: string; // Field name when sending `document.referrer` to an endpoint
  }>;
  contentType?: 'application/x-www-form-urlencoded' | 'application/json'; // `Content-Type` header to be set in `fetch()` request
  headers?: HeadersInit; // Header to add to the `fetch()` request <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
}

export interface ValidateOption {
  /* Referrer */
  referrer?: Readonly<{
    comparePart?: 'origin' | 'host' | 'hostname'; // Which parts of the referrer to check (default: `origin`)
    sames?: readonly string[]; // Domain information treated as the same site
  }>;

  /* User agent string */
  ua?: Readonly<{
    denys?: readonly RegExp[]; // If matches this regular expression, do not send report
    allows?: readonly RegExp[]; // If matches this regular expression, send report
  }>;
}
```
