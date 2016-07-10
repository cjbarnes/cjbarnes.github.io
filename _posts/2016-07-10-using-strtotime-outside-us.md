---
title: using strtotime outside the US
date: 2016-07-10 12:42:00 +0100
tags:
- utilities
format: tip
length: long
languages:
- PHP
---

PHP's strtotime function makes working with user-inputted dates wonderfully simple...as long as you're American. For the rest of us, here's a simple way to make it correctly interpret dates in *day/month/year* order.
{:.lead}

<!--more-->

<figure class="link anchor" markdown="span">
[just skip to the solution...](#a-solution)
</figure>

##  why strtotime is useful

In case you're not familiar with it, [`strtotime` is a PHP function](http://php.net/manual/en/function.strtotime.php "PHP documentation on strtotime") that acts as a natural-language parser for dates and times written in English.

The power of `strtotime` is its flexibility. As well as interpreting absolute dates in almost any English format, it also works with relative dates like '+3 days 2 hours', 'now', or even 'next Wednesday'.

This flexibility makes `strtotime` brilliant for handling user input in particular. Why give complicated instructions to your users on how to type in dates, when you can let them type using the format that makes sense to them and interpret the results with just one line of PHP code?

## the problem with strtotime (outside the US)

Consider a common abbreviated date:

> **1/12/2015**

For Americans, that date is January 12th 2015. For Europeans, Russians, Indians, South Americans, Central Americans, North Africans, South Africans, Australians, New Zealanders...(the list goes on), it’s 1st of December 2015.

The whole world is united against the American date format, as this (exaggerated, but not by much) map that was passed around last year illustrates:

<blockquote class="twitter-tweet" data-lang="en-gb" markdown="0"><p lang="en" dir="ltr">Comprehensive map of all countries in the world that use the MMDDYYYY format <a href="http://t.co/jaOQp0oZyN">pic.twitter.com/jaOQp0oZyN</a></p>&mdash; ᶘ ᵒ㉨ᵒᶅ (@donohoe) <a href="https://twitter.com/donohoe/status/597876118688026624">11 May 2015</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Clearly `strtotime` has to have a consistent way to deal with the inconsistency between date ordering in the US and everywhere else. PHP's solution seems like a compromise, but actually it prioritizes the US in the most common case:

<figure class="quote">
> Dates in the *m/d/y* or *d-m-y* formats are disambiguated by looking at the separator between the various components: if the separator is a slash (/), then the American *m/d/y* is assumed; whereas if the separator is a dash (-) or a dot (.), then the European *d-m-y* format is assumed.

<cite>[*PHP.net*](http://php.net/manual/en/function.strtotime.php "PHP documentation on strtotime")</cite>
</figure>

This 'solution' robs non-American users of the function's most powerful feature---the interpretation of natural-language dates in any format. **Non-Americans use slashes in dates too.** So as a designer of websites targeted at people in the UK, I cannot simply pass user-inputted dates straight into `strtotime`. Users will be both confused and annoyed if they type `1/12/16` and the website misinterprets their input as 12th January.

## a solution

There is a real solution to the limitations of `strtotime`, if you want it to assume a non-American date order at all times, even when the date contains slashes.

Remember, `strtotime` looks for the slash character as a marker for whether the date is American or not. So all we have to do is replace all slashes in the date string with an alternative character.

The easiest way to do this is to include this helper function---called `world_strtotime`---in your PHP project, and then remember to use it everywhere you would normally use `strtotime`:

{% highlight php %}
<?php
/**
 * Version of strtotime() that doesn't use American dates.
 *
 * `strtotime()` interprets a date with slashes as American - i.e. m/d/y. So we
 * replace all slashes with dashes, to stop it from doing this.
 *
 * @author cJ barnes <chris@cjbarnes.co.uk>
 * 
 * @param string $time A date/time string.
 * @param int    $now  Optional. The timestamp which is used as a base for the
 *                     calculation of relative dates.
 * @return string The strtotime() output.
 */
function world_strtotime($time, $now = null) {
    if (is_null($now)) {
        $now = time();
    }
    $str = str_replace('/', '-', $time);
    return strtotime($time, $now);
}
{% endhighlight %}

The `world_strtotime` function will catch dates in *day/month/year* format and convert them to *day-month-year*, before passing them on to the standard PHP `strtotime`. It accepts all the same arguments as `strtotime` and uses them in the same way.

With this approach, you get access to the full power of `strtotime` without having to make exceptions for dates with slashes in them.

<figure class="link" markdown="span">
[get the code](https://gist.github.com/cjbarnes/f2b9ee54ef93ff41c0c1b8116b289ec8 "Gist: world-strtotime.php")
</figure>