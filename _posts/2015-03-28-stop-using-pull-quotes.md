---
title: stop using pull quotes!
format: thoughts
tags:
- design
illustration: pullquote
masthead: light
---

I believe that pull quotes do more harm than good and should be expunged from the modern web designer's toolbox.
{: .lead}

<figure class="pullquote">
"Pull quotes are short excerpts of text from an article, repeated in a large and stylistically different block of text"
</figure>

In this post, we're going to look at the purpose of pull quotes from a *print* designer's perspective. This will then help us to judge their effectiveness in *web* design. Lastly, we'll look at some of the usability problems caused by pull quotes on the web.

## why pull quotes work in print design

Pull quotes have their place, and that place is print design---magazines, newspapers, leaflets, and books. They evolved to fill specific needs of print publications, and they do so very successfully.

What needs are filled by a pull quote?<!--more-->

<figure class="quote">
>   Used to attract attention [...] a pull quote is a *teaser* or visual signpost that draws readers into an article

<cite>[Jacci Howard Bear, desktop publishing expert](http://desktoppub.about.com/od/glossary/g/Pull-Quote.htm "About.com - Source for quote about pull quotes")</cite>
</figure>

<figure class="quote">
>   [A pull quote is used] to draw attention to the text of the article or story from which it is quoted

<cite>[Dictionary.com](http://dictionary.reference.com/browse/pull-quote "Source for definition of 'pull quote'")</cite>
</figure>

Pull quotes are used to grab readers' attention and encourage them to read the main text of the article. To understand why they are important, we need to think about how the average person reads print publications.

Imagine a person is leafing through a magazine, reading only the articles that interest her. As she scans each page of the magazine, she will look at four things:

- the article title
- subheadings, if they are eyecatching enough
- any photos or illustrations
- any short blocks of text that appear large, colourful, and distinctive---in other words, pull quotes.

By scanning those four areas, she gets clues as to the subject and style of the article, from which she makes a choice as to whether she's interested enough to read it.

What's notable here is that pull quotes are the only 'real' text from the article that she will look at before deciding whether to read the whole thing. **Pull quotes are like movie trailers**; they give a flavour of the content of the complete work in as short a period of time as possible.

Here's the key thing to remember so far: **the point of a pull quote is to encourage you to read the article**.

## why pull quotes don't work in web design

Unfortunately, pull quotes do not do the same job on websites, because the way we choose what to read on the web is completely different.

Imagine you are deciding whether to read an article published by the [*Guardian*](http://www.theguardian.com). You might come across it while browsing the *Guardian* website itself---in which case, you'll see a link like this:




TODO put in the images and lines

Whichever of these routes led you to the article, they have one thing in common: all you can see before you click is the headline, a single line summary, and possibly a photo.

You can't see a pull quote until you've clicked the article. But once you've clicked, you've already made a decision to start reading the article! So **the pull quote cannot possibly encourage more people to read the article.** They fail in the purpose that they are intended for.[^1]

## pull quote problems

As well as failing to entice prospective readers, pull quotes actually make it harder to read your content.

### problem 1: they're distracting

TODO

### problem 2: they pollute your HTML

Almost every time you see a pull quote on a website, the text used for the pull quote appears twice in the website's markup. Here is a typical example of pull quote HTML:[^2]

<figure class="code">
{% highlight html %}
<p>This is the ordinary text of the article, which is not pulled out in a pull quote. However, this sentence (in summarized form) is used both in the main body of the article and the pull quote. You will see the pull quote version of it below this paragraph.</p>
<aside class="pullquote">
    <blockquote>
        <p>This sentence is used both in the main body and in the pull quote</p>
    </blockquote>
</aside>
<p>The body text continues...</p>
{% endhighlight %}
</figure>

The actual content of the pull quote appears twice---once in the main body text, and once in an `<aside>` element---and then CSS is used to move the aside version out of the main text and into a different style and position on the page. However, **this only works if your site's CSS is being used to style your content**.

Here is what a blind or visually impaired person would hear when browsing a website that uses our example pull quote markup:

    XXX TEST TODO test with WebAnywhere

They will hear the pull quote text twice, which is likely to be confusing or at least annoying.

In an RSS reader, this is what the user will see:

TODO


TODO summary



[^1]: So far, I have ignored a secondary purpose of pull quotes: *aesthetics*. Put simply, pull quotes look nice, and that helps to establish a more attractive and stylish-looking website.

    Aesthetics would absolutely be reason enough to use pull quotes, *provided they did not harm the usability of the website*. However, as the final section of this post shows, pull quotes cause very real usability and accessibility problems.
    
    So pull quotes are another example of the classic web designer's trade-off between aesthetic appeal and usability. Faced with these choices, good web designers have long since learned to [prioritize usability over appearance](http://www.smashingmagazine.com/2008/08/05/7-essential-guidelines-for-functional-design/). If pull quotes get in the way of our content rather than enhancing it, they have to go.

[^2]: The example pull quote markup is taken from [a tutorial page on the excellent HTML Dog website](http://htmldog.com/techniques/pullquotes/ "Pull Quotes - HTML Dog tutorial").

<style>
.content-section .pullquote {
	float: right;
	width: 33%;
	min-width: 10em;
	margin: 0;
	padding: 15px;
	padding: 0.83333rem;
	font-size: 2em;
	line-height: 1.3;
	color: #b1784f;
	background: transparent;
}
</style>
