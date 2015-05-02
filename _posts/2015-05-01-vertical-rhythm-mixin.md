---
title: maintain vertical rhythm with one Sass/Less mixin
languages:
- Sass
- Less
format: tip
length: long
---

TODO
{:.lead}
<!--more-->

## why is this necessary?

TODO

## the mixin

TODO

<figure class="code">
{% highlight sass %}
// Variables.
// TODO: maps

/// Output a rem font size and corresponding line height.
///
/// The leading argument passed in is the number of standard lines, as defined
/// by the site-wide vertical rhythm, which the line-height should equal.
///
/// @require {variable} $font-sizes   Standard font-size values (in rem).
/// @require {variable} $line-heights Matching line heights for each
///                                   $font-sizes key.
///
/// @param {String} $size    The font-size/line-height keyword.
/// @param {Number} $leading Number of standard lines to use for the
///                          line-height.
/// @output font-size and line-height properties in both px and rem.
@mixin font-size-leading($size, $leading: 1) {
    // Input validation.
    @if not map-has-key($font-sizes, $size) {
        @error "$size must be a predefined size name in maps $font-sizes and   $line-heights, was #{$size}";
    }
    @if not unitless($leading) {
        @error "$leading must be a unitless number, was #{$leading}";
    }

    // Output.
    @include rem("font-size", map-get($font-sizes, $size));
    line-height: map-get($line-heights, $size) * $leading;
}
{% endhighlight %}
</figure>
<figure class="code">
<div class="highlight">
<pre><code class="language-less" data-lang="less">// Variables.
@line-height: 1.5;

////
// Set font-size while maintaining vertical rhythm
//
// @param @text-size The size of the text, in pixels or ems
// @param @leading   The number of standard lines the line-height should equal
//
.font-size-line(@text-size: 1, @leading: 1) when (ispixel(@text-size)) {
    @ems: unit((@text-size / @base-font-size));
    font-size: unit(@ems, em);
    line-height: unit(@leading * (@line-height / @ems));
}
.font-size-line(@text-size: 1, @leading: 1) when not (ispixel(@text-size)) {
    font-size: unit(@text-size, em);
    line-height: unit(@leading * (@line-height / @text-size));
}
</code></pre>
</div>
</figure>

## using the mixin

TODO
