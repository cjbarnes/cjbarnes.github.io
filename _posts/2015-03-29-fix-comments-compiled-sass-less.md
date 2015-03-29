---
title: let’s fix comments in compiled Sass and Less
format: thoughts
languages:
- Sass
- Less
- CSS
length: long
---

Sass and Less are robust and invaluable tools for better CSS development, but they make it impossible to write best-practice CSS in one key area: **comments**. We need to change how we comment CSS to keep within the limitations of our preprocessors.
{:.lead}

When developing in Sass or Less, your one set of code can be viewed by yourself and other developers in up to three different formats:

1. The original Sass/Less files
2. Properly formatted CSS with normal indentation, comments, etc.[^1]
3. 'Minified' (i.e. compressed) CSS.

In the original format, you have direct control of how and where your code comments appear. In the minified format, all comments are removed to reduce the file size. However, to produce the second format (unminified CSS), Sass and Less are responsible for the placement and style of your comments.<!--more-->

## what Sass does with your comments (and Less too)

For simple top-level comments, there are no surprises in Sass's and Less's output:

<figure class="code">
{% highlight scss %}
// ORIGINAL SCSS

// This is a preprocessor-only comment, that is intended by the author to be
// removed during compilation.

/* Links
   ========================================================================= */

/* Default link styling.  */
a {
    color: $color-link;
    font-weight: bold;
    text-decoration: none;
}

/* Link hover styling. */
a:hover,
a:focus {
    color: $color-link-hover;
    text-decoration: underline;
}
{% endhighlight %}
</figure>
<figure class="code">
{% highlight css %}
/* COMPILED CSS */

/* Links
   ========================================================================= */
/* Default link styling.  */
a {
    color: mediumpurple;
    font-weight: bold;
    text-decoration: none;
}
/* Link hover styling. */
a:hover,
a:focus {
    color: rebeccapurple;
    text-decoration: underline;
}
{% endhighlight %}
</figure>

In this example, comments starting with `//` have been removed,[^2] but otherwise the comments are all where the author would expect them to be.

However, the results are very different when we introduce **comments for nested selectors** and **inline comments**:

<figure class="code">
{% highlight scss %}
// ORIGINAL SCSS

/* Default link styling.  */
a {
    color: $color-link;
    font-weight: bold;
    text-decoration: none;

    /* Link hover styling. */
    &:hover,
    &:focus {
        color: $color-link-hover;
        text-decoration: underline;
    }
    
    /*
     * Link active styling.
     * 1. Dark red.
     * 2. @todo: consider reinstating the underlining for active links.
     */
    &:active {
        color: #8b0000; /* 1 */
        text-decoration: none; /* 2 */
    }
}
{% endhighlight %}
</figure>
<figure class="code">
{% highlight css %}
/* COMPILED CSS */

/* Default link styling.  */
a {
    color: mediumpurple;
    font-weight: bold;
    text-decoration: none;
    /* Link hover styling. */
    /*
     * Link active styling.
     * 1. Dark red.
     * 2. @todo: consider reinstating the underlining for active links.
     */
}
a:hover,
a:focus {
    color: rebeccapurple;
    text-decoration: underline;
}
a:active {
    color: #8b0000;
    /* 1 */
    text-decoration: none;
    /* 2 */
}
{% endhighlight %}
</figure>

Not very helpful. The comments for `&:hover` and `&:active` are under the wrong selector; those comments are outputted in one long block, which is confusing and harder to read; and the inline comment `/* 1 */` looks like it relates to text-decoration rather than colour because it was moved to the next line. Worst of all, the numbered inline comments[^3] are in a different block to the 'Link active styling' comment that provides explanations to match the numbers!

What we can see from this is that Sass does not understand that a comment on the line before a selector must relate to that selector rather than its containing block. Sass also cannot keep inline comments on the same lines as the code they relate to. Less shares these problems, producing identical output in this case.

In one edge case, Sass's approach to comments can even result in unnecessary blocks appearing in the compiled CSS: 

<figure class="code">
{% highlight scss %}
// ORIGINAL SCSS

h1,
h2,
h3,
h4,
h5,
h6 {
    /* Use small element as a subhead. */
    small {
        color: gray;
    }
}
{% endhighlight %}
</figure>
<figure class="code">
{% highlight css %}
/* COMPILED CSS */

h1,
h2,
h3,
h4,
h5,
h6 {
    /* Use small element as a subhead. */
}
h1 small,
h2 small,
h3 small,
h4 small,
h5 small,
h6 small {
    color: gray;
}
{% endhighlight %}
</figure>

This looks odd and wastes space (screen space in your favourite text editor if nothing else).

None of the example comments I've used that cause problems for Sass and Less are out of the ordinary. Placing a comment before a selector to explain its contents is just about the only rule that all CSS style guides have in common. Yet that rule is fundamentally broken in CSS preprocessors unless we either stop using nesting[^4] or never comment nested blocks, neither of which is an acceptable solution.

## ways around this problem

Let's cut to the last page: **Either we must abandon our near-universal CSS commenting style, or Sass and Less must get smarter with their comment handling.**

<figure class="quote">
> I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.

<cite>Jimmy Dean</cite>
</figure>

Until Sass and Less change (if they ever do), we need a way to get sensible comments output from our code using the tools that we have.

I don't have a perfect solution, but I do have a partial suggestion that satisfies these criteria:

1. All comments must be *within* the block they explain. (Otherwise the comments and the code may be separated in the compiled CSS.)
2. Comments should never appear below the lines of code they relate to. (To match standard practice in every programming or markup language I've seen).
3. Comments cannot be placed on the same line as code. (Otherwise Sass will move inline comments to the next line, violating the second criterion.)

Therefore I suggest that we place block-level comments in our CSS *just below* the selector and opening brace `{`. I also suggest we place inline comments just before the lines they relate to, in the same block but *on a separate line*.

<figure class="code">
{% highlight scss %}
// ORIGINAL SCSS

/* Links
   ========================================================================= */

a {
    /* Default link styling.  */
    color: $color-link;
    font-weight: bold;
    text-decoration: none;

    &:hover,
    &:focus {
        /* Link hover styling. */
        color: $color-link-hover;
        text-decoration: underline;
    }

    &:active {
        /* Link active styling. */
        /* Dark red. */
        color: #8b0000;
        /* @todo: consider reinstating the underlining for active links. */
        text-decoration: none;
    }
}
{% endhighlight %}
</figure>
<figure class="code">
{% highlight css %}
/* COMPILED CSS */

a {
    /* Default link styling.  */
    color: mediumpurple;
    font-weight: bold;
    text-decoration: none;
}
a:hover, a:focus {
    /* Link hover styling. */
    color: rebeccapurple;
    text-decoration: underline;
}
a:active {
    /* Link active styling. */
    /* Dark red. */
    color: #8b0000;
    /* @todo: consider reinstating the underlining for active links. */
    text-decoration: none;
}
{% endhighlight %}
</figure>

This commenting style definitely has its own problems. It is very different to the standards currently adopted by the web design community. In fact, abandoning the comments-before-blocks approach means moving CSS away from the commenting style of *every other language we use*, including JavaScript, PHP, and even HTML.

There is also a new edge case introduced by this style: the 'is it a block comment or inline comment?' problem:

<figure class="code">
{% highlight css %}
h1 {
    /* This BLOCK comment relates to the whole H1 block. */
    font-size: 2em;
    font-weight: bold;
}

h2 {
    /* This INLINE comment relates to just the font-size property. */
    font-size: 2em;
    font-weight: bold;
}

h3 {
    /* This BLOCK comment relates to the whole H1 block. */
    /* This INLINE comment relates to just the font-size property. */
    font-size: 2em;
    font-weight: bold;
}
{% endhighlight %}
</figure>

As you can see, a comment that applies to the whole block looks identical to a comment that applies to just the first line of that block. The best way I can think of to get around this problem is using `/**` for block comments:

<figure class="code">
{% highlight css %}
h3 {
    /** This BLOCK comment relates to the whole H1 block. */
    /* This INLINE comment relates to just the font-size property. */
    font-size: 2em;
    font-weight: bold;
}
{% endhighlight %}
</figure>

I think this is the best solution, but it does mean reusing the `/**` prefix, which is well-established as a marker for special code comments in JavaDoc, phpDoc, JSDoc, and similar automated documentation generators. However, at least this should be safe from a technical point of view because of the lack of traction for [CSSDOC](https://groups.google.com/forum/#!forum/cssdoc), CSS's version of these generators.[^5]

## concluding thoughts

This new approach to Sass and Less commenting is a huge change, and it definitely needs more thought.

Whether we adopt this or another solution, I hope this post has shown that:

* our current approach to CSS commenting doesn't work with Sass and Less
* we need to find a way to fix this, otherwise the CSS we create will be all-but unusable to the many developers who do not use preprocessors.

[^1]: On some projects, compiling unminified CSS isn't necessary, so the comments issue described in this post is irrelevant. But there are also many projects where unminified commented CSS is hugely important.

    For example, frameworks such as [Bootstrap](http://getbootstrap.com) or [the WordPress starter theme Underscores](http://underscores.me) are written in Sass or Less, but are still useful to developers that don't use these preprocessors. Those developers read and manually change the framework's compiled CSS instead of modifying the Sass/Less. Even if you don't work on this sort of project, the compiled CSS should still be a priority for you if you're a freelancer or a one-person development team. Your code may be handed on to someone else to develop or fix in the future (e.g. if you move on to another job), and if your successor doesn't use the same preprocessor as you, they are likely to start with your compiled CSS instead of your source files.
    
    Our unminified CSS output deserves attention. However, compiled CSS is much less useful if our code comments aren't included (or even worse, if the comments are outputted in the wrong places). This is why we need a workaround for Sass's and Less's comment problems.

[^2]: The `//` prefix is a feature in both Sass and Less, used to differentiate comments that should and shouldn't be present in compiled CSS.

[^3]: This type of inline comment is used by [Idiomatic CSS](https://github.com/necolas/idiomatic-css#5-practical-example)---arguably the most well-known CSS coding style standard---and in the extraordinarily popular [Normalize.css reset](https://github.com/necolas/normalize.css/blob/master/normalize.css) by the same author.

[^4]: I'm aware of course that [prominent web developers have begun to advocate we use nesting as little as possible](http://www.sitepoint.com/beware-selector-nesting-sass/ "Article: Beware of selector nesting in Sass"). But even those who are against nesting allow that it can useful in some cases, for example for pseudo-elements like `&:before` or pseudo-classes like `&:hover`. As long as we use nesting at least some of the time, we need a commenting style that works with it.

[^5]: There is also a Sass version called, unsurprisingly, [SassDoc](http://sassdoc.com); but SassDoc uses triple-slashes (`///`) instead of `/**` for its comments, so it would not conflict with the proposed changes to CSS comments.
