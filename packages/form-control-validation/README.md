# Input validation of form control

[![npm version](https://badge.fury.io/js/%40w0s%2Fform-control-validation.svg)](https://www.npmjs.com/package/@w0s/form-control-validation)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-form-control-validation.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-form-control-validation.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/form-control-validation/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/form-before-unload-confirm": "..."
    }
  }
</script>
<script type="module">
  import formControlValidation from '@w0s/form-control-validation';

  formControlValidation(document.querySelectorAll('.js-form-control-validation')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<!-- input -->
<p><input class="js-form-control-validation" pattern="[a-zA-Z0-9]+"
  aria-errormessage="validation-input"
  title="Only alphanumeric characters can be used."
/></p>
<p hidden="" id="validation-input"></p>

<!-- radio buttons -->
<p role="radiogroup" class="js-form-control-validation" aria-errormessage="validation-radio">
<label><input type="radio" required="" />Radio 1</label>
<label><input type="radio" required="" />Radio 2</label>
</p>
<p hidden="" id="validation-radio"></p>

<!-- select -->
<p><select class="js-form-control-validation" required="" aria-errormessage="validation-select">
<option label="Please select"></option>
<option value="1">Select 1</option>
<option value="2">Select 2</option>
</select></p>
<p hidden="" id="validation-select"></p>

<!-- textarea -->
<p><textarea class="js-form-control-validation"
  aria-errormessage="validation-textarea"></textarea></p>
<p hidden="" id="validation-textarea"></p>
```

## HTML Attributes

<dl>
<dt><code>aria-errormessage</code> [required]</dt>
<dd>ID of the element that displays the validation message. See <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage">WAI-ARIA 1.2</a> for details.</dd>
<dt><code>title</code> [optional]</dt>
<dd>Message displayed when the value does not match the <code>pattern</code> attribute value. <a href="https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute">HTML spec</a> says, <q cite="https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute">When an <code>input</code> element has a <code>pattern</code> attribute specified, authors should include a <code>title</code> attribute to give a description of the pattern.</q></dd>
</dl>

## Invalid style example

```css
:where(input, select, textarea):user-invalid,
[role='radiogroup']:has(input[type='radio']:user-invalid) {
  /* any styles */
}
```

or

```css
:where(input, [role='radiogroup'], select, textarea)[aria-invalid='true'] {
  /* any styles */
}
```
