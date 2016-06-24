---
title: using strtotime in Europe
tags:
- utilities
format: tip
length: long
languages:
- PHP
---

PHP's `strtotime` function makes working with user-inputted dates wonderfully simple...as long as you're American. For the rest of us, here's a simple way to make it correctly interpret dates in *day/month/year* order.
{:.lead}

## the power of strtotime

In case you're not familiar with it, [`strtotime` is a PHP function](http://php.net/manual/en/function.strtotime.php "PHP documentation on strtotime") that acts as a natural-language parser for dates and times written in English.

The power of `strtotime` is its flexibility. As well as interpreting absolute dates in almost any English format, it also works with relative dates like '+3 days 2 hours', 'now', or even 'next Wednesday'.

This flexibility makes `strtotime` brilliant for handling user input in particular. Why give complicated instructions to your users on how to type in dates, when you can let them type using the format that makes sense to them and interpret the results with just one line of PHP code?

## the problem with strtotime (outside the US)

However, with this flexibility comes one crucial problem, caused by the difference between American and European date order.<!--more--> Consider a common English abbreviated date:

> **1/12/2015**

For British, Australian, and European readers, that date is 1st of December 2015; but for Americans, the day and month are reversed, leading to the date January 12th 2015.

Clearly this type of date is ambiguous, and `strtotime` has to have a consistent way to deal with it. PHP's solution is not at all satisfactory for European users:

<figure class="quote">
> Dates in the *m/d/y* or *d-m-y* formats are disambiguated by looking at the separator between the various components: if the separator is a slash (/), then the American *m/d/y* is assumed; whereas if the separator is a dash (-) or a dot (.), then the European *d-m-y* format is assumed.

<cite>[*PHP.net*](http://php.net/manual/en/function.strtotime.php "PHP documentation on strtotime")</cite>
</figure>

This is a pragmatic solution, but it robs non-American users of the function's most powerful feature---the interpretation of natural-language dates in any format. **Europeans use slashes in dates too.** So as a designer of websites targeted at people in the UK, I cannot simply pass user-inputted dates straight into `strtotime`. Users will be both confused and annoyed if they type `1/2/16` and the website misinterprets their input as 2nd January.

## a solution

There is a solution to the limitations of `strtotime`, if you want it to assume a European date order at all times, including when the date contains slashes.

Remember, `strtotime` looks for the slash character as a marker for whether the date is American or not. So all we have to do is replace all slashes in the date string with an alternative character.

The easiest way to do this is to include this helper function---called `eu_strtotime`---in your PHP project, and then remember to use it everywhere you would normally use `strtotime`:

{% highlight php %}
<?php
/**
 * Version of strtotime() that doesn't use American dates.
 *
 * `strtotime()` interprets a date with slashes as American - i.e. m/d/y. So we
 * replace all slashes with dashes, to stop it from doing this.
 *
 * @author cJ barnes <mail@cjbarnes.co.uk>
 * 
 * @param string $time A date/time string.
 * @param int    $now  Optional. The timestamp which is used as a base for the
 *                     calculation of relative dates.
 * @return string The strtotime() output.
 */
function eu_strtotime($time, $now = null) {
    if (is_null($now)) {
        $now = time();
    }
    $str = str_replace('/', '-', $time);
    return strtotime($time, $now);
}
{% endhighlight %}

The `eu_strtotime` function will catch dates in *day/month/year* format and convert them to *day-month-year*, before passing them on to the standard PHP `strtotime`.

With this approach, you get access to the full power of `strtotime`, but with support for all date formats commonly used in the UK.
