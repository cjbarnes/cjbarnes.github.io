(function () {
  'use strict';

  /**
   * Animate between 'brags' in the homepage tagline.
   */
  function doHomepageBrags() {

    var brags = document.querySelectorAll('.homepage .js-brag');

    /* End if this isn't the homepage or there aren't multiple brags to switch
       between. */
    if (brags.length < 2) {
      return;
    }

    var setBragTimeout = setTimeout.bind(null, nextBrag, 5000);
    setBragTimeout(0);

    /**
     * Self-calling function that animates between brags.
     * @param {Number} current The array ID of the current brag.
     */
    function nextBrag(current) {

      /* Animate out the previous brag */
      brags[current++].classList.remove('current');

      /* Work out which brag is next */
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
