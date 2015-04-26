---
title: the next best thing to responsive retina images
tags:
- responsive web design
format: tip
length: long
languages:
- HTML
---

What can you do when your website's images look low-res on retina screens but you can't use a 'real' responsive images technique?
{:.lead}

*File this tip under 'useful hacks when there's no alternative', not 'web design good practice'!*

<!--more-->

High-resolution screens are everywhere these days. Pretty much all mobile phones and tablets have them. Many new laptops have them. Even desktops have them, with the rise of 4K displays. [Ever since Apple released the iPhone 4](http://www.smashingmagazine.com/2010/11/17/designing-for-iphone-4-retina-display-techniques-and-workflow/ "Smashing Magazine article on designing for iPhone 4"), the web design community has understood that our websites need to support 'retina'[^1] screens, or at least *will* need to support them very soon.

The general approach to retina-izing websites is to have separate low- and high-res image files. Then we use a responsive design technique such as [`srcset`](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/ "CSS Tricks page on using srcset for resolution changes") (for HTML images), media queries (for CSS background images), or a script like [Picturefill](http://scottjehl.github.io/picturefill/) to tell the user's web browser which images it should load. So users with retina screens get the sharper and higher-quality image, and everyone else gets a lower-quality image that's smaller and therefore loads faster. Everyone's happy.

Unfortunately, all of these options require you to have two versions of each image. Here's some reasons you may not be able to do that:

- You use an inflexible CMS that doesn't allow direct control of image markup or JavaScript.
- Your content editors aren't capable of writing `srcset` or Picturefill markup.
- Your CMS controls image filenames, so you can't reliably refer to your images in manually written markup.
- You don't want to add complexity to the image uploading process by forcing content editors to create two files per image.

So we need a one-image solution to retina support, preferably without wasting our user's bandwidth by forcing them to download the retina image even when they're using a low-res screen that doesn't make the most of it. Does this one-image solution exist? Yes...sort of.

## retina-ready JPEGs in one image

Here's my (compromised, hacky, imperfect) way of making one image do for both retina and non-retina screens:

**Save your JPEGs at retina size, but really low quality.**

TODO: what quality affects. See JPEG artifacts.

TODO: when you size down to 1x, the artifacts disappear because they're all averaged out!

TODO: what about at 2x? the artifacts are still there, but they're mostly too small to see!

TODO: so we get the small file size of 1x but with sufficient image resolution to look *decent* on 2x. Still no substitute for 2x at a higher quality, but *much much* better than 1x scaled up to 2x, and *much much* smaller than 2x.

TODO: I've tested this on a 2014 MacBook Pro, which has an unbelievably gorgeous screen. It works. 

## what about PNGs and GIFs?

TODO: just use the @2x image. BUT be careful of dodgy scaling of alpha transparency in PNGs...best to not use alpha if possible.

[^1]: Just so we're clear, this tip applies to all high-resolution displays, not just Apple's. But I'm going to use the term 'retina' in this article because it's easier and because I'm an Apple nerd.
