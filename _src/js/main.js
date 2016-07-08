/* globals has3dSupport, isDetailsSupported */

(function () {
  'use strict';

  /**
   * Navigation menu for mobile layout.
   */
  function doMobileNav() {

    /* Variables. */
    var siteNavToggle;
    var siteNav = document.getElementById('site-navigation');
    var navBar = document.getElementById('navbar');

    /* Create navigation toggle. */
    siteNavToggle = document.createElement('button');
    siteNavToggle.appendChild(document.createTextNode('menu'));
    siteNavToggle.classList.add('nav-menu-toggle');
    siteNavToggle.id = 'site-navigation-toggle';
    siteNavToggle.onclick = navToggle.bind(siteNavToggle);

    /* Update the DOM with the toggle button and the hidden-by-default menu. */
    siteNav.parentNode.insertBefore(siteNavToggle, siteNav);
    navBar.classList.toggle('open');
    navBar.classList.toggle('closed');


    /**
     * Toggles the nav visible/invisible classes.
     */
    function navToggle() {

      /* Class changes. */
      siteNavToggle.classList.toggle('active');
      navBar.classList.toggle('open');
      navBar.classList.toggle('closed');

    }

  }

  /**
   * Initialize and do parallax effect on illustrations.
   */
  function doParallax() {

    /* Variables */
    var illustrations;
    var numberOfIllustrations;
    var transformProperty;
    var transformProperties = [
      'transform',
      'webkitTransform',
      'mozTransform',
      'msTransform'
    ];

    /**
     * Check for browser support.
     */

    /* 3D translates (don't bother with fallback). */
    if (!has3dSupport()) {
      return;
    }

    /* Find parallax illustrations */
    illustrations = document.querySelectorAll('.illustration .img');
    numberOfIllustrations = illustrations.length;

    if (!numberOfIllustrations) {
      // No illustrations to parallax.
      return;
    }

    /* Check which transition property to use. */
    var i, l;
    for (i = 0, l = transformProperties.length; i < l; i++) {

      if (transformProperties[i] in illustrations[0].style) {

        transformProperty = transformProperties[i];
        break;
      }
    }

    if (!transformProperty) {
      // 3D transforms aren't supported. (This is already checked for, so it
      // shouldn't really happen.)
      return;
    }

    /* Last check: requestAnimationFrame. */
    window.requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame;

    /**
     * Event listeners.
     */

    /* Listen for frame draws after scrolling or window sizing. */
    var parallaxOnRedraw = requestAnimationFrame.bind(null, parallax);
    window.addEventListener('scroll', parallaxOnRedraw);
    window.addEventListener('resize', parallaxOnRedraw);

    /* Call `parallax()` on load, to prevent a small jump on first scroll. */
    window.addEventListener('load', function smoothlyStartParallaxing() {
      parallax();
      // Turn off the smooth animation, it's not needed from this point.
      window.setTimeout(function stopSmoothParallaxing() {
        document.body.classList.add('parallax-loaded');
      }, 300); // 300ms = the length of the CSS transition
    });

    /**
     * Recalculate the parallax positions for each illustration.
     */
    function parallax() {

      var i, l;
      var illus;
      var illusHeight;
      var illusTranslate;
      var boxRect;
      var boxTop;
      var boxHeight;
      var windowHeight = window.innerHeight;

      for (i = 0, l = numberOfIllustrations; i < l; i++) {

        // First get all the data we need to check whether this is onscreen.
        illus = illustrations[i];
        boxRect = illus.parentNode.getBoundingClientRect();
        boxTop = boxRect.top;
        boxHeight = boxRect.height;

        /* Ignore if this element is offscreen. */
        if ((boxTop > (boxHeight * -1)) && (boxTop < (windowHeight))) {

          // Last bit of data we need.
          illusHeight = illus.getBoundingClientRect().height;

          /* Recalculate the `top` position, in case the window has resized */
          illus.style.top = '' + ((boxHeight - illusHeight) / 2) + 'px';

          /* If the image is way bigger than its container (and isn't in the
           * masthead), make the animation less speedy/jarring */
          if (((illusHeight * 0.65) > boxHeight) && (0 < i)) {
            boxHeight = boxHeight * 1.3;
          }

          /* Calculate the correct translation */
          illusTranslate = ((boxHeight - illusHeight) * ((boxTop * 2) + boxHeight - windowHeight)) / ((boxHeight + windowHeight) * 2);

          /* Apply the transform. */
          var style = 'translate3d(0,' + Math.round(illusTranslate) + 'px,0)';
          illus.style[transformProperty] = style;

        }

      }

    }

  }

  /**
   * Initialize the details element if it isn't supported by this browser.
   */
  function polyfillDetails() {

    if (!isDetailsSupported) {

      /* Add class marker to show that details has to be polyfilled */
      var html = document.getElementsByTagName('html')[0];
      html.classList.add('no-details');

      /* Polyfill the details behaviour */
      document.addEventListener('click', function (e) {
        if ('summary' === e.target.tagName) {
          var summary = e.target;
          var details = summary.parentName;
          var a = 'open';

          if (details.getAttribute(a)) {
            details.removeAttribute(a);
          } else {
            details.setAttribute(a, a);
          }
        }
      });

    }

  }

  /**
   * Adds ids to content subheadings, so they can be linked to.
   */
  function linkifySubheadings() {

    /* Get the subheading elements */
    var subheads = document.querySelectorAll('.js-linkify-subheadings h2');

    /* Add ID and link to each subheading in turn */
    var i, l;
    for (i = 0, l = subheads.length; i < l; i++) {

      var subheadID;

      if (! subheads[i].id) {

        /* Get content */
        subheadID = subheads[i].textContent;

        /* Prepare a HTML4-compatible, jQuery-compatible ID and apply to element. */
        subheadID = subheadID.toLowerCase().replace(/[^\w-]/g, '_');
        subheads[i].id = subheadID;

      } else {

        subheadID = subheads[i].id;

      }


      /* Build link for this subhead ID. */
      var href = '//' + location.host;
      href += (location.pathname ? location.pathname : '');
      href += '#' + subheadID;

      /* Create permalink to this subheading and append to element. */
      var link = document.createElement('a');
      link.appendChild(document.createTextNode('#'));
      link.href = href;
      link.title = 'permalink to this subheading';
      link.classList.add('hashlink');
      subheads[i].appendChild(link);

    }

  }

  /**
   * On DOM ready, begin all DOM changes and event handler setup.
   */
  function initEverything() {

    doMobileNav();
    doParallax();
    polyfillDetails();
    linkifySubheadings();

  }

  // Check for minimum level of JS support.
  if (('addEventListener' in window) && ('querySelector' in document)) {

    // Apply JS-only targeting CSS.
    var html = document.getElementsByTagName('html')[0];
    html.classList.remove('no-js');
    html.classList.add('js');

    // Register initializing functions with the DOM ready event.
    if ('loading' !== document.readyState) {
      initEverything();
    } else {
      document.addEventListener('DOMContentLoaded', initEverything);
    }

  }

})();
