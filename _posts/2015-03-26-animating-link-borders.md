---
title: animating link borders in CSS
format: tip
languages:
- CSS
- Sass
length: long
---

Three trends in webpage link styling seem to have proliferated over recent years:

- applying a CSS `border-bottom` instead of the usual `text-decoration: underline` to underline links
- only underlining links when the mouse is hovered over them
- using CSS `transition` to animate any colour or other styling changes on hover

However, combining these three techniques on the same site causes problems if not done carefully.<!--more--> Try hovering over the links below for examples[^1] of what can go wrong with animated border-bottom links. Underneath each example is the CSS that created it.

### issue 1: sudden appearance of underlining

[This link's underlining appears in its final colour immediately, but the link text's colour change is still going on.](#){:.example-1}

<figure class="code">
{% highlight css %}
a {
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: color 1s linear;
}
a:hover,
a:focus {
    border-bottom: 1px solid maroon;
    color: rebeccapurple;
}
{% endhighlight %}
</figure>

### issue 2: delayed appearance of underlining

[This link's underlining doesn't appear at all until the colour change is complete, then it suddenly appears without animating.](#){:.example-2}

<figure class="code">
{% highlight css %}
a {
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
}
a:hover,
a:focus {
    border-bottom: 1px solid;
    color: rebeccapurple;
}
{% endhighlight %}
</figure>

### issue 3: line height shifts

[This link's underlining causes the link to increase in height slightly, moving all other text further down the page.](#){:.example-3}

<figure class="code">
{% highlight css %}
a {
    display: block; /* inline-block causes the same effect */
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
}
a:hover,
a:focus {
    border-bottom: 4px solid;
    color: rebeccapurple;
}
{% endhighlight %}
</figure>

## the right way to animate border-bottom

To avoid these three issues, simply apply a transparent `border-bottom` to the link **in its initial, no-hover state**. The transparent border must be the same width and style as the non-transparent border will be on hover. The result:

[This link animates properly, hurrah!](#){:.example-4}

<figure class="code">
{% highlight css %}
a {
    border-bottom: 1px solid transparent;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
    /* Alternative transition if you don't want to animate `all`:
    transition: color 1s linear, border-color 1s linear;
    */
}
a:hover,
a:focus {
    border-bottom-color: rebeccapurple;
    color: rebeccapurple;
}
{% endhighlight %}
</figure>

The border fades in perfectly in time with the text colour change, and the link's height doesn't change at all.

Why does this work? Because when we set the `border-bottom` to transparent, it exists and takes up space on the page even though it isn't visible. This means that, when the border becomes visible on hover, nothing has to shift down to make room for it. It also means the border can appear to fade in smoothly, because it isn't really transitioning from 'doesn't exist' to 'exists' (a transition that CSS isn't capable of animating), but from 'transparent colour' to 'opaque colour'.

So remember: when animating in borders, **change the border's colour, not the width or style**.

---

**Bonus:** Here's a quick [Sass](http://sass-lang.com) mixin for an appearing border-bottom, matching the CSS above. Just `@include` it in the CSS for your link elements and (optionally) supply a hover colour and a duration for the animation:

<figure class="code">
{% highlight scss %}
/// Animate in a border-bottom on hover or focus.
///
/// @param {String} $hover-color The color the link should change to on hover.
/// @param {Number} $duration    How long the animation should take.
/// @output Color, border and transition styles.
@mixin cj-hover-border($hover-color: #639, $duration: 0.25s) {
    border-bottom: 1px solid transparent;
    transition: color $duration linear, border-color $duration linear;

    &:hover,
    &:focus {
        border-bottom-color: $hover-color;
        color: $hover-color;
    }
}

/* Usage */
a {
    @include cj-hover-border(rebeccapurple, 1s);
    color: blue;
    text-decoration: none;
}
{% endhighlight %}
</figure>


[^1]: These are exaggerated examples so that you can easily see the precise sequence of the animations. Hopefully you wouldn't have seconds-long transitions for links on your own website!


<style>
/* Reset */
.example-1,
.example-2,
.example-3,
.example-4 {
    background: transparent;
    transition: none;
}
.example-1:hover,
.example-1:focus,
.example-2:hover,
.example-2:focus,
.example-3:hover,
.example-3:focus,
.example-4:hover,
.example-4:focus {
    background: transparent;
    transition: none;
}
/* Example styles */
.example-1:link {
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: color 1s linear;
}
.example-1:hover,
.example-1:focus {
    border-bottom: 1px solid maroon;
    color: #639;
}
.example-2:link {
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
}
.example-2:hover,
.example-2:focus {
    border-bottom: 1px solid;
    color: #639;
}
.example-3:link {
    display: inline-block;
    border-bottom: 0;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
}
.example-3:hover,
.example-3:focus {
    border-bottom: 4px solid;
    color: #639;
}
.example-4:link {
    border-bottom: 1px solid transparent;
    color: blue;
    text-decoration: none;
    transition: all 1s linear;
}
.example-4:hover,
.example-4:focus {
    border-bottom-color: #639;
    color: #639;
}
</style>
