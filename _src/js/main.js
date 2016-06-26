/* globals isIOS, has3dSupport */

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
    if (isIOS() || ! has3dSupport()) {
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

    /* Call `parallax()` on load, to prevent a small jump on first scroll. */
    document.addEventListener('DOMContentLoaded', parallax);
    window.addEventListener('onload', parallax);

    /**
     * Recalculate the parallax positions for each illustration.
     */
    function parallax() {

      var i, l;
      var illus;
      var rectTop;
      var speed = 4; // Increased after 'featured' article

      for (i = 0, l = numberOfIllustrations; i < l; i++) {

        illus = illustrations[i];
        // 120 = -1 * the top property of the .img (in px; set in CSS)
        rectTop = illus.getBoundingClientRect().top + 120;

        /* Ignore if this element is obviously offscreen. */
        if ((rectTop > -1000) && (rectTop < 1600)) {

          /* Apply the transform. */
          var style = 'translate3d(0,' + Math.round((-1 * rectTop) / speed) + 'px,0)';
          illus.style[transformProperty] = style;

        }

        /* Sets stronger parallax effect for the remaining illustrations. */
        speed = 8;

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
