# Convert date control to `<input type=text>`

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-date-to-text.svg)](https://www.npmjs.com/package/@w0s/input-date-to-text)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-date-to-text.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-input-date-to-text.yml)

Converts `<input type=date>` in the HTML source code to `<input type=text>`. In some cases, it is troublesome to select a date decades ago in the calendar picker of the browser, so use it when you dare to set `<input type=text>` such as date of birth.

- In addition to the YYYY-MM-DD format, you can enter in the YYYY/MM/DD and YYYYMMDD formats.
- You can omit leading 0 of the month and day, such as 2000-1-3 or 2000/1/3.
- You can also enter in full-width numbers.
- If a non-existent date such as February 30 is entered, the error message specified by the `data-validation-noexist` attribute is set to [`HTMLInputElement.setCustomValidity()`](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-setcustomvalidity). (The specific behavior depends on the browser, but most will be displayed in a tooltip).

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/input-date-to-text/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-date-to-text": "..."
    }
  }
</script>
<script type="module">
  import inputDateToText from '@w0s/input-date-to-text';

  inputDateToText(document.querySelectorAll('.js-input-date-to-text')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<input type="date" class="js-input-date-to-text"
  data-title="Dates should be consecutive numbers or separated by `-` or `/` in the order of year, month, and day."
  data-validation-noexist="This date does not exist."
  min="2000-01-01"
  data-validation-min="Please enter a value after A.D.2000."
  max="2020-12-31"
  data-validation-max="Please enter a value before A.D.2020."
/>
```

## HTML attributes

<dl>
<dt><code>data-title</code> [optional]</dt>
<dd>The program automatically sets the <code>pattern</code> attribute. <a href="https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute">HTML spec</a> says, <q cite="https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute">When an <code>input</code> element has a <code>pattern</code> attribute specified, authors should include a <code>title</code> attribute to give a description of the pattern</q>. Therefore, as an equivalent to the <code>title</code> attribute, set a message to be displayed when the value does not match the <code>pattern</code> attribute value.</dd>
<dt><code>title</code> [prohibition]</dt>
<dd><strong>Use the <code>data-title</code> attribute instead.</strong> The reason for this is to ensure consistency in script disabled environments.</dd>
<dt><code>data-validation-noexist</code> [required]</dt>
<dd>Error message when a non-existent date such as February 30 is entered.</dd>
<dt><code>min</code>, <code>max</code> [optional]</dt>
<dd>Of the attributes that can be specified with <code>&lt;input type=date&gt;</code>, <a href="https://html.spec.whatwg.org/multipage/input.html#the-min-and-max-attributes">the <code>min</code> and <code>max</code> attributes</a> can be specified. Please refer to the HTML specification for the usage of attributes.</dd>
<dt><code>data-validation-min</code> [conditionally required]</dt>
<dd>Error message when a date past the <code>min</code> attribute value is entered.</dd>
<dt><code>data-validation-max</code> [conditionally required]</dt>
<dd>Error message when a date future the <code>max</code> attribute value is entered.</dd>
<dt><code>step</code> [prohibition]</dt>
<dd><strong><a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-step"><code>Step</code> attribute</a> are not supported.</strong></dd>
</dl>
