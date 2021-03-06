---
title: better Gift Aid calculator, part 1
date: 2016-07-08 10:36:00 +0100
languages:
- JavaScript
- jQuery
format: tutorial
length: long
---

I wanted to make a better [Gift Aid](//www.gov.uk/donating-to-charity/gift-aid "GOV.UK page about Gift Aid") calculator for UK charity websites---one that's easier to use, more eye-catching, and better explains how Gift Aid actually works. [So I built one](https://www.yorkspace.net/giftaid "University of York's Gift Aid calculator") for the University of York. This tutorial will help you to build one too.
{:.lead}

The second part of this tutorial will cover the thing that makes my Gift Aid calculator distinctive: its **design**. There I will also outline the design flaws of the existing Gift Aid calculators, which led me to work on an alternative. But before we work on the calculator's layout and aesthetics, we first need the basic JavaScript that makes a Gift Aid calculator work. Follow this first part of the tutorial to find out how to do that.<!--more-->

*(NB: this Gift Aid calculator script support all modern browsers as well as Internet Explorer 8 and above.)*

<figure class="link" markdown="span">
[just get the code...](https://github.com/cjbarnes/gift-aid-calculator "Gift Aid calculator project on GitHub")
</figure>

## the basic structure

Our script will need three main functions:

{% highlight javascript %}
/**
 * Calculate the amounts claimable and total amounts for a gift at the
 * specified tax rate.
 * @param {Number} initialGift The gross value of the gift in pounds.
 * @param {Number} taxRate     The tax band of the giver (as a percentage).
 * @return {Object} Both initial and calculated values for this gift.
 */
function calculateGiftAid(initialGift, taxRate) { }

/**
 * Perform a Gift Aid calculation and output results to the page.
 * @param {Element} calc The Gift Aid calculator parent element.
 */
function updateGiftAidCalculator(calc) { }

/**
 * On DOM ready, hook up the events that make the Gift Aid calculator work,
 * and set initial values and styling.
 */
function initGiftAidCalculator() { }
{% endhighlight %}

The first function, `calculateGiftAid()`, performs a basic Gift Aid calculation and returns a set of amounts. The second, `updateGiftAidCalculator()`, takes the values returned by the first and outputs them to the visible webpage. The third, `initGiftAidCalculator()`, starts everything off when the page loads---it runs an initial Gift Aid calculation on the default gift amount and tax rate, and then begins listening for user input that should trigger a recalculation.

## step 1: the calculation itself

Let's begin with the heart of our script: the function that calculates how much Gift Aid can be claimed based on the gifted amount and the giver's tax rate.

We need to account for a few subtleties of how Gift Aid works:

1. The official value of Gift Aid to the charity is 20%. However, that's not
   20% of the original gift, it's **20% of the sum of both original gift and Gift Aid**. Which is actually 25%.[^1]
2. For most Gift Aid gifts, the only beneficiary of Gift Aid is the charity.
   The basic rate of 20% tax was paid on the gift, and the charity claims the entire 20% back. However, **higher-rate taxpayers** paid more than 20% tax on the gift so they can claim the rest back themselves. So both charity and taxpayer end up better off, but only if the taxpayer is on the higher rate.
3. In 2015, there are **two higher rates** in the UK---40% and 45%---meaning
   some givers can claim back 20% of their gift and some can claim back 25% (and of course the majority can't claim anything).

We'll start with by calculating the Gift Aid amount that the charity can claim. By adding that to the original gift, we can also work out the *net gift* (i.e. the total amount the charity gains).

{% highlight javascript %}
function calculateGiftAid(initialGift, taxRate) {
    
  /*
   * Convert gift amount into pence for easier (and more accurate) maths. Fall
   * back to 0 if NaN or less than 1p.
   */
  initialGift = parseInt((initialGift * 100), 10) || 0;
  
  // Calculate what the charity gets.
  var charityClaimAmount = initialGift / 4;
  var netGiftReceived = initialGift + charityClaimAmount;
    
{% endhighlight %}

Note that before we begin any calculations, we multiply the gifted amount by 100 and use `parseInt()` to round to the nearest whole number. What this does is **converts from pounds to pence**. This is a good idea whenever you work with currency amounts in JavaScript---it avoids [floating-point number inaccuracies](https://www.youtube.com/watch?v=PZRI1IfStY0 "YouTube video about floating point numbers, by Computerphile") and generally makes the maths a bit easier.

The next step is to handle the extra amount claimable by higher-rate taxpayers. If the giver pays 40% tax, they can claim back '20%' of the total gift (which, like the charity's '20%', really works out as 25%!). If they pay 45% tax, the official figure they can claim back goes up to 25% (which really works out at 33%)[^2].

This time we *subtract* the amount claimable from the original gift. This gives us the real-terms cost of the gift to the giver, after they've claimed  back the amount they're entitled to.

{% highlight javascript %}

  var giverClaimAmount = 0;
  
  /*
   * Calculate amount of tax the giver can claim back. Works out to the
   * difference between the total tax paid on the gift and the amount claimed
   * by the charity. Is always 0 unless this is a higher-rate tax payer.
   */
  if (20 < taxRate) {
    var giverClaimAmount = (netGiftReceived * taxRate / 100) - charityClaimAmount;
  }
  var netGiftGiven = initialGift - giverClaimAmount;
    
{% endhighlight %}

Now we've calculated everything, we just need to return our results. JavaScript only allows you to return one variable per function, which is a problem because we have several amounts to return. The solution to this is to return an *object* that contains all our results, like this:

{% highlight javascript %}

  // Return an object containing all the amounts involved in this gift.
  return {
    // Initial values passed into this function.
    grossGift:       initialGift,
    taxRate:         taxRate,
    // Calculated values.
    charityClaims:   charityClaimAmount,
    giverClaims:     giverClaimAmount,
    netGiftGiven:    netGiftGiven,
    netGiftReceived: netGiftReceived
  };
}
{% endhighlight %}

This allows us to pass all our results back to the calling function as expected. But there's still one problem with our results: the amounts are all in pence, not pounds, since we multiplied the original gift by 100 to make our maths easier. So we need to convert our pence amounts back into pounds. We'll do this with a simple function called `outputAmount()`:

{% highlight javascript %}

  // Return an object containing all the amounts involved in this gift.
  return {
    // Initial values passed into this function.
    grossGift:       outputAmount(initialGift),
    taxRate:         taxRate,
    // Calculated values.
    charityClaims:   outputAmount(charityClaimAmount),
    giverClaims:     outputAmount(giverClaimAmount),
    netGiftGiven:    outputAmount(netGiftGiven),
    netGiftReceived: outputAmount(netGiftReceived)
  };
}

/**
 * Convert monetary values (in pence) into properly formatted pounds-and-pence
 * strings, ready for outputting to the user.
 * @param {Number} pence Amount to output, in pence. Anything after the
 *                       decimal point will be discarded.
 * @return {String} Formatted value (e.g. if pence == 173, return '1.73').
 */
function outputAmount(pence) {
  pence = parseInt(pence, 10) || 0;
  return ((pence / 100).toFixed(2));
}
{% endhighlight %}

We now have a working calculator function! It works fine, but it isn't very future proof. What if the Government adjusts tax rates? If the basic rate of tax changes, every bit of maths in this function will need to be reworked.

A better approach would be to store the basic rate in one variable, and then use that variable in every calculation within this function. Then we'd only need to update a single line of code when the basic rate changes. Unfortunately, this makes the maths rather more complicated[^3], but it's worth it:

{% highlight javascript %}
function calculateGiftAid(initialGift, taxRate) {
  /*
   * The standard tax rate. Any tax above this threshold that is paid on the
   * gift is claimed back by the giver, not the charity.
   */
  var _basicRate = 20;
  
  /*
   * Convert gift amount into pence for easier (and more accurate) maths. Fall
   * back to 0 if NaN or less than 1p.
   */
  initialGift = parseInt((initialGift * 100), 10) || 0;

  // Calculate what the charity gets.
  var charityClaimAmount = initialGift * _basicRate / (100 - _basicRate);
  var netGiftReceived = initialGift + charityClaimAmount;

  var giverClaimAmount = 0;
  /*
   * Calculate amount of tax the giver can claim back. Works out to the
   * difference between the total tax paid on the gift and the amount claimed
   * by the charity. Is always 0 unless this is a higher-rate tax payer.
   */
  if (_basicRate < taxRate) {
    var giverClaimAmount = (netGiftReceived * taxRate / 100) - charityClaimAmount;
  }
  var netGiftGiven = initialGift - giverClaimAmount;

  // Return an object containing all the amounts involved in this gift.
  return {
    // Initial values passed into this function.
    grossGift:       outputAmount(initialGift),
    taxRate:         taxRate,
    // Calculated values.
    charityClaims:   outputAmount(charityClaimAmount),
    giverClaims:     outputAmount(giverClaimAmount),
    netGiftGiven:    outputAmount(netGiftGiven),
    netGiftReceived: outputAmount(netGiftReceived)
  };
}

/**
 * Convert monetary values (in pence) into properly formatted pounds-and-pence
 * strings, ready for outputting to the user.
 * @param {Number} pence Amount to output, in pence. Anything after the
 *                       decimal point will be discarded.
 * @return {String} Formatted value (e.g. if pence == 173, return '1.73').
 */
function outputAmount(pence) {
  pence = parseInt(pence, 10) || 0;
  return ((pence / 100).toFixed(2));
}
{% endhighlight %}

Our calculation function is now complete. In the final version (in the tutorial files) there's some additional niceties, including more robust validation. Download here: [vanilla JavaScript version](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/gift-aid-calculator.js "the finished script file on GitHub - no dependencies") or [jQuery version](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/jquery-gift-aid-calculator.js "the finished script file on GitHub - jQuery version").

## step 2: updating the DOM

Now that we have our calculating function, we need a way to (1) get the user's chosen gift value and tax rate into it and (2) display the calculated results to the user. That's where our DOM-updating function `updateGiftAidCalculator()` comes in.

We want our Gift Aid calculator JavaScript to be as design-agnostic as possible, so we can be flexible in how we mark up and style it in part two of this tutorial. So we'll use a set of HTML classes, each prefixed with `.js-`, to mark the DOM elements that should be updated by our script. Specifically, we'll use these classes:

|--------------------------------+------------------------------------------|
| Class                          | Description                              |
|--------------------------------|------------------------------------------|
| `.js-giftaid-calculator` | Container for all elements in a single Gift Aid calculator |
| `.js-input-gift` | `<input>` that the user types their gift amount into |
| `.js-input-taxrate` | `<select>` with a list of tax rates for the user to choose from |
| `.js-output-gross-gift` | The original gift amount (same as `.js-input-gift`, but not user-editable) |
| `.js-output-giver-claims` | How much tax the giver is entitled to claim back |
| `.js-output-charity-claims` | How much Gift Aid the charity can claim in addition to the gross gift |
| `.js-output-net-gift-given` | The real cost of the gift to the giver, once the amount they can claim has been subtracted |
| `.js-output-net-gift-received` | The real amount the charity gets from the gift, once Gift Aid has been added |
|--------------------------------+------------------------------------------|

Because this function's purpose is communicating between our calculator and the DOM, some parts of it are a little easier using [jQuery](http://jquery.com/). However, it would be wasteful to require jQuery on a webpage solely to make our Gift Aid calculator work. So I've included two versions of each example in this section: one that depends on jQuery and one with no dependencies.

Enough preamble---let's get started by getting the user-inputted gift amount and tax rate and using them to calculate Gift Aid:

<div class="jquery-highlight">
{% highlight javascript %}
function updateGiftAidCalculator($calc) {
  // Check the element in `calc` is a Gift Aid calculator.
  if (!$calc.hasClass('js-giftaid-calculator')) {
    return;
  }

  /*
   * Get the gift/tax amounts chosen by the user. If they don't exist, end
   * here.
   */
  var $giftInput = $calc.find('.js-input-gift');
  var $taxRateInput = $calc.find('.js-input-taxrate');
  if (($giftInput.length) && ($taxRateInput.length)) {
    // Calculate for this gift.
    var gift = calculateGiftAid($giftInput.val(), $taxRateInput.val());
  } else {
    return;
  }
{% endhighlight %}
</div>
{% highlight javascript %}
function updateGiftAidCalculator(calc) {
  // Check the element in `calc` is a Gift Aid calculator.
  if (!calc.className || !(/(^| )js-giftaid-calculator( |$)/.test(calc.className))) {
    return;
  }

  /*
   * Get the gift/tax amounts chosen by the user. If they don't exist, end
   * here.
   */
  var giftInput = calc.querySelector('.js-input-gift');
  var taxRateInput = calc.querySelector('.js-input-taxrate');
  if ((null !== giftInput) && (null !== taxRateInput)) {
    // Calculate for this gift.
    var gift = calculateGiftAid(giftInput.value, taxRateInput.value);
  } else {
    return;
  }
{% endhighlight %}

Note that the function accepts a single argument, called `$calc` in the jQuery version or just `calc` in vanilla JavaScript. This should be a jQuery collection containing our `.js-giftaid-calculator` wrapper element, or just the element itself in the non-jQuery version[^4].

We now have a `gift` object containing all the data we need from this Gift Aid calculation. Next we will find and update the DOM elements that are used to display Gift Aid numbers to the user:

<div class="jquery-highlight">
{% highlight javascript %}
  // Find the output elements in the DOM.
  var outputs = {
    grossGift      : $calc.find('.js-output-gross-gift'),
    taxRate        : $calc.find('.js-output-taxrate'),
    charityClaims  : $calc.find('.js-output-charity-claims'),
    giverClaims    : $calc.find('.js-output-giver-claims'),
    netGiftGiven   : $calc.find('.js-output-net-gift-given'),
    netGiftReceived: $calc.find('.js-output-net-gift-received')
  };

  // Loop through the list-of-collections to update each node's contents.
  $.each(outputs, function (field, $elements) {
    /*
     * Change the contents of all DOM elements in this jQuery collection to
     * = the matching gift-calculation value.
     */
    $elements.text(gift[field]);
  });
  
}
{% endhighlight %}
</div>
{% highlight javascript %}
  // Find the output elements in the DOM.
  var outputs = {
    grossGift      : calc.querySelectorAll('.js-output-gross-gift'),
    taxRate        : calc.querySelectorAll('.js-output-taxrate'),
    charityClaims  : calc.querySelectorAll('.js-output-charity-claims'),
    giverClaims    : calc.querySelectorAll('.js-output-giver-claims'),
    netGiftGiven   : calc.querySelectorAll('.js-output-net-gift-given'),
    netGiftReceived: calc.querySelectorAll('.js-output-net-gift-received')
  };

  // Loop through the list-of-NodeLists to update each node's contents.
  for (var field in outputs) {
    /*
     * Loop through the individual DOM elements in this NodeList and change
     * their contents to = the matching gift-calculation value.
     */
    for (var i = 0, var l = outputs[field].length; i < l; i++) {
      // Equivalent of jQuery's `$(element).text('string')`.
      if (undefined !== outputs[field][i].textContent) {
        outputs[field][i].textContent = gift[field];
      } else {
        outputs[field][i].innerText = gift[field];
      }
    }
  }

}
{% endhighlight %}

We use jQuery's `.text()` method (or JavaScript's `textContent` property) to update all the calculator fields on the page, so the user can see the results for their chosen gift.

Note that the property names of the object `output`---e.g. `grossGift` and `charityClaims`---match exactly the property names in the `gift` object that contains our Gift Aid calculation results. This simplifies our script considerably:

<div class="jquery-highlight">
{% highlight javascript %}
// Instead of doing this...
outputs['grossGift'].text(gift['grossGift']);
outputs['taxRate'].text(gift['taxRate']);
outputs['charityClaims'].text(gift['charityClaims']);
outputs['giverClaims'].text(gift['giverClaims']);
outputs['netGiftGiven'].text(gift['netGiftGiven']);
outputs['netGiftReceived'].text(gift['netGiftReceived']);

// ...we can just do this...
$.each(outputs, function(field, $elements) ) {
    $elements.text(gift[field]);
}

// ...because `outputs[field]` always matches up with `gift[field]`.
{% endhighlight %}
</div>

This function has one more job to do. It's likely that in the final design, we'll want to hide the 'tax you can claim back' section of the calculator until the user chooses a higher tax rate. (Otherwise, basic-rate givers will see a field that is always £0 and wonder what it's there for.)

So we'll build in an extra class---`.show-giver-claims`---which will be added to the main Gift Aid calculator element whenever the user selects a higher tax rate. This can then be used in our CSS to display/hide the relevant elements. Here's our JavaScript to add and remove the class:

<div class="jquery-highlight">
{% highlight javascript %}
if ('0.00' !== gift.giverClaims) {
  $calc.addClass('show-giver-claims');
} else {
  $calc.removeClass('show-giver-claims');
}
{% endhighlight %}
</div>
{% highlight javascript %}
if (calc.classList) {
  if ('0.00' !== gift.giverClaims) {
    calc.classList.add('show-giver-claims');
  } else {
    calc.classList.remove('show-giver-claims');
  }
} else {
  // Fallback for browsers that don't support classList.
  var classRegex = /(^| )show-giver-claims( |$)/;
  if (('0.00' !== gift.giverClaims) && !classRegex.test(calc.className)) {
    calc.className += ' show-giver-claims';
  } else if (('0.00' === gift.giverClaims) && classRegex.test(calc.className)) {
    calc.className = calc.className.replace(classRegex, ' ');
  }
}
{% endhighlight %}

The DOM communication function is now finished. Again, the final version has some validation and other improvements. Download here: [vanilla JavaScript version](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/gift-aid-calculator.js "the finished script file on GitHub - no dependencies") or [jQuery version](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/jquery-gift-aid-calculator.js "the finished script file on GitHub - jQuery version").

Now the only thing left to write is the function that initializes our Gift Aid calculator when the webpage loads.

## step 3: initializing everything

All Gift Aid calculator code that runs when the page first loads is kept in a single function, which we'll call `initGiftAidCalculator()`.

Our initializing function makes heavy use of event listeners, so our non-jQuery version has to work around the differences between the modern `addEventListener` API and `attachEvent` as used in old versions of Internet Explorer. [MDN has a great polyfill for the event listener API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility), but we don't need all of its features so we'll use something much simpler instead:

{% highlight javascript %}
/**
 * Hook into a DOM element event, abstracting around IE8's lack of support
 * for `addEventListener()`.
 * @param {Element}  target   The element that should listen for this event.
 * @param {String}   type     The name of the event type to listen for.
 * @param {Function} listener The function to call when this event occurs.
 */
function addEventListener(target, type, listener) {
  if (target.addEventListener) {
    target.addEventListener(type, listener);
  } else {
    target.attachEvent('on' + type, function(e) {
      // Prepare the Event object to better match `addEventListener`.
      e.target = e.srcElement;
      e.currentTarget = target;
      e.preventDefault = function() {
        this.returnValue = false;
      };
      // Call the event listener with `this` and Event object set.
      listener.call(target, e);
    });
  }
}
{% endhighlight %}

We also need a way to call the initializing function when the DOM's ready to be scripted, as a replacement for jQuery's `$(document).ready()`. Compare how `initGiftAidCalculator()` is called in the jQuery and vanilla JavaScript versions:

<div class="jquery-highlight">
{% highlight javascript %}
// Initialize on DOM ready.
$(document).ready(initGiftAidCalculator);
{% endhighlight %}
</div>
{% highlight javascript %}
/*
 * Initialize on DOM ready. All of this block is the equivalent of jQuery's
 * `$(document).ready(initGiftAidCalculator)`.
 */
if ('loading' !== document.readyState) {
  initGiftAidCalculator();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', initGiftAidCalculator);
} else {
  // IE.old version of DOMContentLoaded event.
  document.attachEvent('onreadystatechange', function () {
    if ('loading' !== document.readyState) {
      initGiftAidCalculator();
    }
  });
}
{% endhighlight %}

Now that the event-model housekeeping is out of the way, we can write the function itself. First let's find our calculator elements in the DOM and run an initial Gift Aid calculation on them:

<div class="jquery-highlight">
{% highlight javascript %}
function initGiftAidCalculator() {
  var $calculators = $('.js-giftaid-calculator');

  // End here if there aren't any Gift Aid calculators on the page.
  if (!$calculators.length) {
    return false;
  }

  /*
   * Initialize events and first calculation for each Gift Aid calculator in
   * turn.
   */
  $calculators.each(function () {
    var $calc = $(this);

    // Run the Gift Aid calculation for the first time, updating all fields.
    updateGiftAidCalculator($calc);
{% endhighlight %}
</div>
{% highlight javascript %}
function initGiftAidCalculator() {
  var i,
      l,
      calc,
      calculators = document.querySelectorAll('.js-giftaid-calculator');

  // End here if there aren't any Gift Aid calculators on the page.
  if (!calculators.length) {
    return false;
  }

  /*
   * Initialize events and first calculation for each Gift Aid calculator in
   * turn.
   */
  for (i = 0, l = calculators.length; i < l; i++) {
    calc = calculators[i];

    // Run the Gift Aid calculation for the first time, updating all fields.
    updateGiftAidCalculator(calc);
{% endhighlight %}

As in `updateGiftAidCalculator()`, we don't assume there's just one Gift Aid calculator on the page. We get all calculators in the DOM and set each of them up in term, using `.each()` in jQuery and a for loop in vanilla JavaScript.

Now we've run our calculations once, the visible part of the Gift Aid calculator is now ready. We just need to hook up `updateGiftAidCalculator()` to the right DOM events, so the amounts in the calculator will update to match the user's input.

Here we have a decision to make: **when should the numbers in the calculator update?**

1. When the user clicks an 'Update' button or presses the Enter key? *(This is the most common approach.)*
2. Immediately as the user types in new gift amounts or clicks a different tax rate?

I strongly believe Option 2 is better---in fact it is a principal reason why I started working on my own Gift Aid calculator. Updating while the user types makes the calculator feel much more responsive; the user instantly sees results as they make changes, which encourages them to experiment to see what happens. Instant changes can make the calculator feel almost fun to use. Option 1 adds an unnecessary action (and time delay) between the user's actions and their receiving the results[^5].

To make Option 2 work, we need to update all values whenever the change event is called on the calculator's `<input>` or `<select>` element. We also have to capture individual keystrokes on the input, since its change event is only called when it loses focus. Lastly, we need to turn off the Gift Aid calculator form's submit element, since we won't be using it.

<div class="jquery-highlight">
{% highlight javascript %}
    // Prevent form submission.
    $calc.submit(cancelGiftAidFormSubmission);

    /*
     * Attach recalculation-triggering events. Don't bother if this Gift Aid
     * calculator is missing one or both of its inputs.
     */
    var $giftInput = $('.js-input-gift');
    var $taxRateInput = $('.js-input-taxrate');
    if ($giftInput.length && $taxRateInput.length) {
      $giftInput.on('keyup, change', updateGiftAidDelegate($calc));
      $taxRateInput.change(updateGiftAidDelegate($calc));
    }

  });

}

/**
 * Quick event listener to prevent form submission (since we are handling all
 * form processing in JavaScript).
 * @this target
 * @param {Event} e Event object.
 */
function cancelGiftAidFormSubmission(e) {
  e.preventDefault();
}

/**
 * Wrap the update function in a closure, so it can be used in an event
 * listener without losing the reference to the current Gift Aid calculator.
 * @param {Element} $calc The Gift Aid calculator parent element (as a jQuery
 *                        object).
 * @return {Function} Event handler that calls `updateGiftAidCalculator()`.
 */
function updateGiftAidDelegate($calc) {
  return function () {
    updateGiftAidCalculator($calc);
  };
}
{% endhighlight %}
</div>
{% highlight javascript %}
    // Prevent form submission.
    addEventListener(calc, 'submit', cancelGiftAidFormSubmission);

    /*
     * Attach recalculation-triggering events. Don't bother if this Gift Aid
     * calculator is missing one or both of its inputs.
     */
    giftInput = calc.querySelector('.js-input-gift');
    taxRateInput = calc.querySelector('.js-input-taxrate');
    if ((null !== giftInput) && (null !== taxRateInput)) {
      addEventListener(giftInput, 'keyup', updateGiftAidDelegate(calc));
      addEventListener(giftInput, 'change', updateGiftAidDelegate(calc));
      addEventListener(taxRateInput, 'change', updateGiftAidDelegate(calc));
    }

  }

}

/**
 * Quick event listener to prevent form submission (since we are handling all
 * form processing in JavaScript).
 * @this target
 * @param {Event} e Event object.
 */
function cancelGiftAidFormSubmission(e) {
  e.preventDefault();
}

/**
 * Wrap the update function in a closure, so it can be used in an event
 * listener without losing the reference to the current Gift Aid calculator.
 * @param {Element} calc The Gift Aid calculator parent element.
 * @return {Function} Event handler that calls `updateGiftAidCalculator()`.
 */
function updateGiftAidDelegate(calc) {
  return function () {
    updateGiftAidCalculator(calc);
  };
}
{% endhighlight %}

Note that the vanilla JavaScript version makes full use of the cross-browser `addEventListener()` function we created earlier.

The most unexpected thing about our `initGiftAidCalculator()` implementation is the addition of another tiny function: `updateGiftAidDelegate()`. The point of this extra function (which itself just returns another function) is to create a **[closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures "MDN article on closures")** around our call to `updateGiftAidCalculator()`. I won't explain what closures are or how they work here---just google "javascript closures" if you're unfamiliar with them. All you need to know is that we need a closure so we can pass the correct `$calc`/`calc` element to `updateGiftAidCalculator()` when it is called by an event listener. By passing `calc` in as an argument, we avoid having to traverse up the DOM to find the right ancestor element every single time an event is triggered.

* * *

Now we have a complete, working Gift Aid calculator script! It's available in both [vanilla JavaScript](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/gift-aid-calculator.js "the finished script file on GitHub - no dependencies") and [jQuery-dependent](https://github.com/cjbarnes/gift-aid-calculator/blob/master/src/jquery-gift-aid-calculator.js "the finished script file on GitHub - jQuery version") versions on [GitHub](https://github.com/cjbarnes/gift-aid-calculator "Gift Aid calculator project on GitHub"), along with minified versions and example HTML.

<figure class="link" markdown="span">
[get the code](https://github.com/cjbarnes/gift-aid-calculator "Gift Aid calculator project on GitHub")
</figure>

**All that's left to do is our Gift Aid calculator design---coming soon in part two of this tutorial...**

[^1]: Don't read this footnote if algebra gives you nightmares. But for the mathematically inclined among you, here's why Gift Aid is officially 20% but really 25%. We'll use a **starting gift of £10** as an example.
    
    The rule is that Gift Aid is worth 20% (i.e. a fifth) of the *whole gift*---that is, both the gift and its additional Gift Aid. If we make that into an equation (we'll call the Gift Aid amount **x** to make things easier), Gift Aid appears on both sides of the equals sign:
    
    **x = (£10 + x) ÷ 5**
    
    So to 'solve x' and work out the Gift Aid, we must (in the words of a thousand GCSE Maths textbooks) *simplify*:
    
    a: *multiply each side by 5:*
    
    **5x = £10 + x**
    
    b: *take x (one Gift Aid) from each side:*
    
    **4x = £10**
    
    c: *divide each side by 4:*
    
    **x = £10 ÷ 4**
    
    Therefore the Gift Aid amount is one-fourth (25%) of the original gift---in this case, £2.50.

[^2]: Why can higher-rate taxpayers claim money back, and why do 45% taxpayers get more than 40% taxpayers?
    
    The short answer is, 'because HMRC says so', but we can give a slightly more helpful answer by looking at things this way:
    
    - The basic principle of Gift Aid is that charitable giving should be tax-free. (This is an oversimplification, but it will do for now.)
    - So HMRC agrees to refund *all* the income tax paid on a charitable gift via Gift Aid.
    - If a gift comes from a higher-rate taxpayer, more income tax was paid on that gift; therefore there is a bigger amount for HMRC to refund.
    - Then the only question is how that amount gets distributed between the charity and the giver. The answer is simple: **the charity always gets the amount of tax a basic-rate taxpayer would have paid** (i.e. 20%).
    - Anything left after the charity's cut goes back to the giver.
    - Because the charity's cut is the same as the basic rate, that means there is no tax left for basic-rate givers to get back, but there *is* tax left for higher-rate taxpayers to receive.
    
    (Of course, all this depends on the giver and the charity actually claiming the refunds they're entitled to from HMRC.)
    
    So for a highest-rate taxpayer:
    
    - Income tax paid was 45%
    - Charity takes 20%
    - Therefore 25% is left over for the taxpayer to claim.

[^3]: Scary algebra part two. To make an equation that will work for *any* basic tax rate, we need to introduce the letter **y** to represent the basic rate (e.g. if the basic rate is 20%, y = 20):
    
    **x = (£10 + x) × (y / 100)**
    
    This equation is a pain to simplify, but it's possible:
    
    a: *rearrange right-hand side:*
    
    **x = ((£10 + x) × y) ÷ 100**
    
    b: *multiply each side by 100:*
    
    **100x = (£10 + x) × y**
    
    c: *rearrange again:*
    
    **x × 100 = (£10 × y) + (x × y)**
    
    d: *subtract (x × y) from each side:*
    
    **(x × 100) - (x × y) = £10 × y**
    
    e: *simplify the multiplications on the left-hand side:*
    
    **x × (100 - y) = £10 × y**
    
    f: *divide each side by (100 - y):*
    
    **x = (£10 × y) ÷ (100 - y)**
    
    And we're done! Just replace y with the basic rate of tax to solve x:
    
    **x = (£10 × 20) ÷ (100 - 20) = £2.50**
    
    I doubt these workings are useful to anyone, but they took ages to figure out so I'm preserving them here for posterity...!

[^4]: We use the `calc` wrapper element to scope the `updateGiftAidCalculator()` function to a single Gift Aid calculator, by using `calc` as the starting point for finding the other DOM elements we need. We do this to allow for the (probably only theoretical) possibility that there could be more than one Gift Aid calculator on the same page. If we didn't do this scoping, and there were two Gift Aid calculators on a page, inputting the gift amount in one calculator would change both calculators' totals.

[^5]: Are there downsides to instant updating? Possibly, but I haven't come across any. Certainly there are no performance concerns in updating on every keystroke, since the script runs very quickly under normal conditions (easily quicker than a user can type), and there is no round-tripping to the server required.
