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

  await reportSameReferrer('https://report.example.com/referrer', {
    fetchParam: {
      documentURL: 'documentURL',
      referrer: 'referrer',
    },
    fetchContentType: 'application/json',
    fetchHeaders: {
      'X-Requested-With': 'hoge',
    },
    condition: 'origin',
    same: [
      'https://www1.example.com',
      'https://www2.example.com',
    ],
    denyUAs: [
      /Googlebot\/2.1;/,
    ],
  });
</script>
```

## Default function

```TypeScript
async (endpoint: string, options: Readonly<Option>): Promise<void>
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
    referrer: string;
  };
  fetchContentType?: 'application/x-www-form-urlencoded' | 'application/json';
  fetchHeaders?: HeadersInit;
  condition?: 'origin' | 'host' | 'hostname';
  same?: string[];
  denyUAs?: RegExp[];
  allowUAs?: RegExp[];
}
```

<dl>
<dt><code>fetchParam.documentURL</code></dt>
<dd>Field name when sending the URL of the document to an endpoint.</dd>
<dt><code>fetchParam.referrer</code></dt>
<dd>Field name when sending `document.referrer` to an endpoint.</dd>
<dt><code>fetchContentType</code></dt>
<dd><code>Content-Type</code> header to be set in <code>fetch()</code> request.</dd>
<dt><code>fetchHeaders</code></dt>
<dd>Header to add to the <code>fetch()</code> request. Specify the <a href="https://fetch.spec.whatwg.org/#typedefdef-headersinit">HeadersInit</a> type.</dd>
<dt><code>condition</code></dt>
<dd>Which parts of the referrer to check. Has the same meaning as the <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL#instance_properties">URL interface properties</a>. The default value when omitted is <code>origin</code>.</dd>
<dt><code>same</code></dt>
<dd>Domain information treated as the same site. Specify the format according to the value of <code>condition</code>.
<ul>
<li><code>condition: origin</code> → 'https://www1.example.com'</li>
<li><code>condition: host</code> → 'www1.example.com:999'</li>
<li><code>condition: hostname</code> → 'www1.example.com'</li>
</ul></dd>
<dt><code>denyUAs</code></dt>
<dd>If a user agent matches this regular expression, do not send report.</dd>
<dt><code>allowUAs</code></dt>
<dd>If a user agent matches this regular expression, send report. If neither <code>denyUAs</code> nor <code>allowUAs</code> is specified, any file name will be accepted.</dd>
</dl>
