---
title: stop using pull quotes!
date: 2016-07-12 18:16:00 +0100
format: thoughts
tags:
- design
languages:
- HTML
image: /img/pullquote.jpg
masthead: light
---

Pull quotes are incredibly useful---in print. They grab your attention as you flick through a magazine, encouraging you to choose to read *this* article. They act as a 'teaser' for the article's topic and main point. Title aside, they are the first thing you'll see and the last thing you'll remember of that thing you just read.
{: .lead}

As long as they're in print.

Unfortunately, **none of these useful functions are filled by pull quotes on webpages.** In fact I'd go further: pull quotes online are an annoyance, a distraction, and an accessibility disaster. They should be expunged from the modern web designer's toolbox.

<!--more-->

<figure class="pullquote">
"Pull quotes are short excerpts of text from an article, repeated in a large and stylistically different block of text"
</figure>

If you haven't heard the term before, pull quotes are short excerpts of text from an article, repeated in a large and stylistically different block of text[^1]. Part of the previous sentence is repeated nearby in large pink text; that is an example of a pull quote.

## the failure of pull quotes

Let's look at a typical example of a web-based pull quote, taken from a [Macworld article by the excellent Dan Moren](http://www.macworld.com/article/3090532/ios/its-the-ecosystem-stupid-why-apples-latest-oss-complete-each-other.html "article containing an example of a pull quote") of the equally excellent [Six Colours website](http://sixcolours.com/):

<figure class="image" markdown="0">
<img src="/img/blog/macworld-pull-quote-wide.jpg" srcset="/img/blog/macworld-pull-quote-wide@2x.jpg 2x, /img/blog/macworld-pull-quote-wide.jpg" width="944" height="670" alt="Screenshot of the Macworld article. The pull quote is directly below the paragraph it is drawn from. As a result, the screen only has room to show about three paragraphs at once instead of four.">
<figcaption>A pull quote in a <a href="http://www.macworld.com/article/3090532/ios/its-the-ecosystem-stupid-why-apples-latest-oss-complete-each-other.html" title="article containing an example of a pull quote">Macworld article</a>, on a normal-sized screen</figcaption>
</figure>

Notice the ways in which this pull quote fails to meet the ideals we listed earlier:

- **Can't be seen when you're deciding whether to read or not.** The pull quote only appears when you've clicked to go to this webpage---i.e. when you've already made a positive choice to start reading it. The online equivalent of flicking through a magazine is scanning the homepage or a Google results page; for the pull quote to affect your decision, it needs to be there, not on the article page itself.
- **Too late to be tease you.** It's too far down the page to act as a teaser of the content. By the time you've scrolled down this far, you're already deep into reading the article.
- **Too early to remind you.** Conversely, it's too far *up* the page to remind you of a key point after you've finished reading. By the time you've scrolled to the end, the pull quote is already off screen.

This pull quote has failed to attract more readers, failed to introduce them to what they're starting to read, and failed to remind them of its key point at the end. On every level, this typical pull quote is not fit for purpose.

## the problems with pull quotes

Online pull quotes don't just fail to do their jobs; they actively get in the way of your experience as a reader.

Consider how our example looks on a mobile phone:

<figure class="image" markdown="0">
<img src="/img/blog/macworld-pull-quote-mobile.jpg" srcset="/img/blog/macworld-pull-quote-mobile@2x.jpg 2x, /img/blog/macworld-pull-quote-mobile.jpg" width="250" height="410" alt="Screenshot of the Macworld article on a mobile phone. Now the pull quote takes up a third of the visible page.">
<figcaption>The same pull quote on an iPhone 6</figcaption>
</figure>

Now the pull quote takes up so much space, it's graduated from 'irrelevant' to 'in the way'. Between the pull quote itself and the sentence it repeats verbatim, it uses up a full 50% of the screen. At best this is unhelpful.

But even the mobile web browsing case is better than many alternatives. Consider situations where you are reading just the text of an article, without even seeing its design[^2]. Here's that same page viewed in [Reeder](http://reederapp.com/ios/), my favourite RSS reader app:

<figure class="image" markdown="0">
<img src="/img/blog/macworld-pull-quote-reeder.jpg" srcset="/img/blog/macworld-pull-quote-reeder@2x.jpg 2x, /img/blog/macworld-pull-quote-reeder.jpg" width="400" height="711" alt="Screenshot of the Macworld article in the Reeder app. Now the pull quote takes up a third of the visible page.">
<figcaption>The same pull quote in Reeder</figcaption>
</figure>

Because all the text is the same size and colour, **there's no obvious way to tell apart the pull quote and the rest of the content**. From the reader's perspective, there are two consecutive paragraphs that start with exactly the same sentence. It looks like a mistake by the writer, and a pretty stupid one at that. Certainly it will distract the reader and disrupt their flow as they read the article.

Surely that's the worst case scenario for pull quotes spoiling webpages. Except no, it isn't. The actual worst case scenario is this:

<figure class="media" markdown="0">
<audio src="/media/macworld-pull-quote-screenreader.m4a" controls></audio>
<figcaption>The same pull quote and surrounding text, read aloud by a screen reader</figcaption>
</figure>

This is what a blind or visually impaired user will hear as they 'read' (really 'listen to') the page. Here the repeated sentence is even more jarring, and it's impossible to distinguish between the original text and its pull quote version. In fact, since the two are identical, **a blind user actually cannot tell where this sentence was actually supposed to be**. In this case, that's not going to affect the article's meaning. But it's not hard to imagine a much worse result.

One very plausible outcome: imagine a political news article where part of a speech by the Prime Minister is used as a pull quote. The PM's words are now taken out of the flow of the main text and, from a blind user's perspective, could appear anywhere. Imagine if they end up inserted into the middle of a comment by the PM's political opponent! That would drastically affect the meaning of the article, and could leave the 'reader' utterly misinformed about an important issue that affects them.

* * *

Hopefully you're now convinced of the harm caused by pull quotes on the web, as well as their inability to encourage you to read an article or to help you digest and retain it.[^3] There is no justification for pull quotes' continued use on webpages. The sooner we abandon them, the better the experience for everyone---blind and visually impaired users, mobile-phone readers, RSS users, emailers, compulsive webpage printers, and everyday users who just want your site's design to *get out of the way* so they can focus on reading and enjoying your content.

[^1]: I started drafting this post over a year ago. (I would've finished it earlier but I didn't have a website to put it on!) In that initial spell of writing, I believe I pulled this definition verbatim from a webpage. However I can't find the original source in my notes or on Google. In the absence of a citation, please just assume someone cleverer and better informed than me wrote it...

[^2]: Common examples of this use case include RSS readers, apps like Flipboard, browser tools like Safari Reader, and Apple News and similar services. Not to mention copy-and-pasting a webpage's text into an email or document, or printing it. In all these cases, the user will see you text but won't see all or part of the design it normally sits within.

[^3]: Throughout this article, I've ignored a secondary purpose of pull quotes: *aesthetics*. Put simply, pull quotes look nice, and that helps to establish a more attractive and stylish-looking website.

    Aesthetics would absolutely be reason enough to use pull quotes, *provided they did not harm the usability of the website*. However, as the final section of this post shows, pull quotes cause very real usability and accessibility problems.
    
    So pull quotes are another example of the classic web designer's trade-off between aesthetic appeal and usability. Faced with these choices, good web designers have long since learned to [prioritize usability over appearance](http://www.smashingmagazine.com/2008/08/05/7-essential-guidelines-for-functional-design/ "Smashing Magazine: 7 essential guidelines for functional design"). If pull quotes get in the way of our content rather than enhancing it, they have to go.

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
