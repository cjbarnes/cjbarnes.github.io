(function () {
  'use strict';

  /**
   * Animate between 'brags' in the homepage tagline.
   */
  function doHomepageBrags() {

    var setBragTimeout;
    var brags = document.querySelectorAll('.homepage .js-brag');
    var choice = brags.length;
    var first = 0;

    /* End if this isn't the homepage or there aren't multiple brags to switch
       between. */
    if (2 > choice) {
      return;
    }

    /* Choose a random starting point for circling through the brags. */
    first = Math.floor(Math.random() * (choice - 1));

    /* Reusable function to change brags in 4 seconds. */
    setBragTimeout = setTimeout.bind(null, nextBrag, 4000);

    /* Show the first brag and start looping. */
    brags[first].classList.add('current');
    setBragTimeout(first);

    /**
     * Self-calling function that animates between brags.
     * @param {Number} current The array ID of the current brag.
     */
    function nextBrag(current) {

      /* Animate out the previous brag. */
      brags[current++].classList.remove('current');

      /* Work out which brag is next. */
      if (brags.length <= current) {
        current = 0;
      }

      /**
       * Wait for animation to end, then animate in next brag.
       * @param {Number} current The array ID of the current brag.
       */
      setTimeout(function animateInBrag(current) {
        brags[current].classList.add('current');

        /* Continue the sequence */
        setBragTimeout(current);

      }, 500, current);

    }

  }

  // Check for minimum level of JS support.
  if (('addEventListener' in window) && ('querySelector' in document)) {

    // Register initializing functions with the DOM ready event.
    if ('loading' !== document.readyState) {
      doHomepageBrags();
    } else {
      document.addEventListener('DOMContentLoaded', doHomepageBrags);
    }

  }

})();
