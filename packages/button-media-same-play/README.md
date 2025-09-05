# Simultaneous playback button for multiple audio / video

[![npm version](https://badge.fury.io/js/%40w0s%2Fbutton-media-same-play.svg)](https://www.npmjs.com/package/@w0s/button-media-same-play)
[![Workflow status](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-button-media-same-play.yml/badge.svg)](https://github.com/SaekiTominaga/js-library-browser/actions/workflows/package-button-media-same-play.yml)

- If you press the button during pause, the playback starts from the position with the lowest playback time.
- Pause if you press a button during playback.
- If all the target media elements has finished playing, start playing from the beginning.

## Demo

- [Demo page](https://saekitominaga.github.io/js-library-browser/packages/button-media-same-play/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-media-same-play": "..."
    }
  }
</script>
<script type="module">
  import ButtonMediaSamePlay from '@w0s/button-media-same-play';

  buttonMediaSamePlay(document.querySelectorAll('.js-button-media-same-play')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<button type="button" class="js-button-media-same-play"
  aria-controls="video1 video2"
>Simultaneous playback</button>

<video src="video.webm" controls="" id="video1"></video>
<video src="video.webm" controls="" id="video2"></video>
```

## HTML attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>aria-controls</code> [required]</dt>
<dd>Space separated list of one or more ID values referencing the media elements being controlled. See the <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls"><code>aria-controls</code></a> attribute of WAI-ARIA for details.</dd>
</dl>
