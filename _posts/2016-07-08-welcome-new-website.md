---
title: welcome to my new website
date: 2016-07-08 22:00:00 +0100
languages:
- CSS
- HTML
- JavaScript
- Jekyll
- jQuery
- Less
- PHP
- Sass
- WordPress
format: project
image: /img/macbook-bed.jpg
length: long
---

Welcome to [cjbarnes.co.uk](/).  This website is my [portfolio](/whativedone/portfolio/), [CV](/whativedone/bio/ "bio"), [soapbox](/blog/ "blog"), and web design playground.
{:.lead}

This post will give a brief overview of how the website is set up, why it's structured the way it is, and what I plan to do with it in the future. More technical details (e.g. how some of the more unusual features of the site work) will be written up in separate posts.

<!--more-->

## the basics

This is a [Jekyll](https://jekyllrb.com) website hosted on [GitHub Pages](https://pages.github.com/). I've used several different [CMSs](https://en.wikipedia.org/wiki/Content_management_system "Wikipedia: content management system") over the years, but this is my first site using a static CMS[^1]. I've enjoyed the different approach. Of course, Jekyll itself is a big part of what I've appreciated: I've found it to be both powerful and simple, with [superb documentation](https://jekyllrb.com/docs/home/ "Jekyll's documentation").

Most of the site's content is written in [Markdown](https://daringfireball.net/projects/markdown/). I like writing in Markdown---it's concise, easy to read, quick to write, and much less erratic and constraining than any [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG "Wikipedia: WYSIWYG") web editor. The fact that it works well with so many different writing apps---including [Byword](https://bywordapp.com), my personal favourite and the app I'm typing into right now---is the icing on the cake.

I'll leave the rest of the nerdy details for a footnote (this one[^2]).

## a website or a blog?

There are two options for structuring a freelance web developer's own website:

1. **really it's a blog**---Almost every page on the site is a blog post. The homepage is just a list of blog posts. Prospective clients can find a few examples of work and contact details, but otherwise the site isn't really written for them; it's written for fellow developers.
2. **really it's a brochure**---The site has a large amount of content addressed to prospective clients, with marketing-friendly titles like 'portfolio' and 'testimonials'. There's still a blog, but it's kept in a small corner of the site. The homepage is dominated by a huge image---either a brash candy-coloured illustration or a workspace photo with 'hipster' turned up to eleven...

Clearly I've leaned towards Option 2 for my own website (dearth of hipsterishness aside). My main reason for creating this site (besides the awkwardness of being a web designer with no website) was because I found myself having the same conversations with my clients: this is what's involved in making a website, this is how the project will go, this is what you'll get at the end, and so on. Because I've adopted a 'brochure' structure for my site, I can now point clients to it for simple explanations of what they need to know.

None of this means that I'll neglect the [blog](/blog/) part of the site; I have a frankly absurd number of post outlines stored up for me to work through...

## my code

All of the code that goes into this website can be found <a href="{{ site.github.repository_url }}" title="GitHub repo for this website">on GitHub</a>. I recommend starting with the <a href="{{ site.github.repository_url }}/tree/master/README.md" title="README.md">readme</a> for specifics on how I've structured the code and where to look first.

Everything on the site that was written by me has been released under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). So please do 'borrow' anything you find here that's useful, and make full use of the code examples in my blog posts. Just remember to link back to where you found it. And if you want to use a photo from this site, please check the [credits and thank-yous](/credits/) page first to make sure you don't unwittingly steal something that has a more restrictive license.

## the future

This is a web designer's website, so of course the blog will heavily feature tips, tutorials, and thoughts related to working on the web. But I'm under no illusions about the world needing *yet another* generic blog about web development. I think I have different things to write about than the average developer, and that's what I intend to do[^3]. 

Outside the blog, I intend to progressively add and improve features of the site over the years. I planned this site to make it easy for me to experiment with new ideas, techniques, and technologies. A developer's website isn't just a blog or a brochure, it's also a playground and learning space for new ideas, techniques, and technologies. Now that the long journey towards finishing my site is over, I can't wait to start 'playing'...

[^1]: If you've followed this footnote, you probably need me to go a bit slower with the technical jargon! Here goes:

    A CMS (content management system) assembles your website for you from its different parts. Consider this webpage as an example: the large white section in the middle of the page (including the text you're reading now) is unique to this webpage; you can't find it anywhere else. We call this unique part of a webpage the 'content'.

    However, above and below the content are areas that are the same on every page of the website; from the links and logo in the header to my contact details in the footer. (If you use PowerPoint or InDesign, these areas are like the 'master' in  those programs.) Areas that are shared by many pages are called different things depending on the CMS, but for now let's call them the 'template'.

    So every webpage is a mixture of two components---content and template. The CMS's job is to assemble each webpage from its components and send it to the user when you click it in Google or type in its web address.

    The CMS can assemble webpages in one of two ways:

    - it can wait until you ask for a webpage, then assemble it and send it to you straight away (this is what a **dynamic CMS** such as [WordPress](https://wordpress.org/) does)
    - it can pre-assemble all the webpages on a site every time a piece of content or template changes, then store them until needed (this is what a **static CMS** like [Jekyll](https://jekyllrb.org/) does)

    There are many advantages to static CMSs, but the big disadvantage is **they can't react to the user** (usually anyway). Most websites show different content to different users---for example, Google shows different search results depending on what you type in, Dropbox shows a different list of files depending on who you are logged in as, and Amazon shows a different shopping basket to each user no matter what part of the site they are on. None of this is possible with a static CMS.

    So static CMSs aren't a realistic option for most website owners, including all of my clients to date. But for a very limited type of website (such as this one), a website that uses a static CMS can be faster, safer, less expensive to run, and easier to work with.

[^2]: The site's CSS is compiled from [Sass](http://sass-lang.com). I prefer [Less](http://lesscss.org) for many reasons (blog post to come, eventually), not least its truly awesome documentation. But when I started this project I needed more Sass experience, so Sass it is. I don't use a Sass framework, and I don't include browser prefixes in my Sass---I let the [Autoprefixer](https://github.com/postcss/autoprefixer) post-processor handle that.

    The site's JavaScript also doesn't use a framework---[no jQuery](http://youmightnotneedjquery.com "You Might Not Need jQuery reference resource"), no nothing. I usually find jQuery to be overkill for one-developer projects, especially given the vastly better JavaScript standards support of Internet Explorer/Edge in the last few years. The various script files that are used by the site are concatenated into one file and minified, and that's it.

[^3]: [One of my first posts](/blog/using-strtotime-outside-us-2016-07-10/ "using strtotime outside the US") outlines a tip that wouldn't appear on the average web blog because it deals with a problem that only affects developers outside the US. [Another early post](/blog/better-gift-aid-calculator-1-2016-07-08/ "better Gift Aid calculator, part 1") is a tutorial about dealing with [Gift Aid](https://www.gov.uk/donating-to-charity/gift-aid), which you're only likely to look at in-depth if you work for a charity (or an accountant) in the UK.

    Hopefully these two examples of doing something different will be joined by many more in the coming months.
