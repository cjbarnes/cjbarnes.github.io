

/**
 * Remove 'no-js' flag from DOM, for use in CSS
 */
(function confirmJavascriptSupport() {

  var html = document.getElementsByTagName('html')[0];
  html.classList.remove('no-js');
  html.classList.add('js');

})();


/**
 * Navigation menu for mobile layout
 */
(function doMobileNav() {

  /* Variables */
  var siteNavigationToggle;
  var siteNavigation = document.getElementById('site-navigation');
  var navBar = document.getElementById('navbar');

  /* Create navigation toggle */
  siteNavigationToggle = document.createElement('button');
  siteNavigationToggle.appendChild(document.createTextNode('menu'));
  siteNavigationToggle.id = 'site-navigation-toggle';
  siteNavigationToggle.onclick = navToggle.bind(siteNavigationToggle);

  /* Update the DOM with the toggle button and the hidden-by-default menu */
  siteNavigation.parentNode.insertBefore(siteNavigationToggle, siteNavigation);
  navBar.classList.toggle('open');
  navBar.classList.toggle('closed');


  /**
   * Toggles the nav visible/invisible classes
   */
  function navToggle() {

    /* Class changes */
    siteNavigationToggle.classList.toggle('active');
    navBar.classList.toggle('open');
    navBar.classList.toggle('closed');

  }

})();


/**
 * Initialize and do parallax effect on illustrations
 */
(function doParallax() {

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
   * Check for browser support
   */

  /* 3D translates (don't bother with fallback) */
  if (isIOS() || ! has3dSupport()) {
    return;
  }

  /* Find parallax illustrations */
  illustrations = document.querySelectorAll('.illustration img');
  numberOfIllustrations = illustrations.length;

  if (!numberOfIllustrations) {
    // No illustrations to parallax
    return;
  }

  /* Check which transition property to use */
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

  /* Last check: requestAnimationFrame */
  window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;


  /**
   * Event listeners
   */

  /* Listen for frame draws after scrolling or window sizing */
  parallaxOnRedraw = requestAnimationFrame.bind(null, parallax);
  window.addEventListener('scroll', parallaxOnRedraw);

  /* Call `parallax()` on load, to prevent a small jump on first scroll */
  document.addEventListener('DOMContentLoaded', parallax);
  window.addEventListener('onload', parallax);

  /**
   * Recalculate the parallax positions for each illustration
   */
  function parallax() {

    var i, l;
    var illus;
    var rect;
    var levelOfParallax = 4; // Increased after 'featured' article

    for (i = 0, l = numberOfIllustrations; i < l; i++) {

      illus = illustrations[i];
      rectTop = illus.getBoundingClientRect().top;

      /* Ignore if this element is obviously offscreen */
      if ((rectTop > -1000) && (rectTop < 1600)) {

        /* Apply the transform */
        illus.style[transformProperty] = 'translate3d(0,'
          + Math.round((-1 * rectTop) / levelOfParallax) + 'px,0)';

      }

      /* Sets stronger parallax effect for the remaining illustrations */
      levelOfParallax = 8;

    }

  }

})();


/**
 * Animate between 'brags' in the homepage tagline
 */
(function doHomepageBrags() {

  var brags = document.querySelectorAll('.homepage .brag span');

  /* End if this isn't the homepage or there aren't multiple brags to switch
     between */
  if (brags.length < 2) {
    return;
  }

  var setBragTimeout = setTimeout.bind(null, nextBrag, 5000);

  setBragTimeout(0);


  /**
   * Self-calling function that animates between brags
   *
   * @param  int next The array ID of the current brag
   */
  function nextBrag(current) {

    /* Animate out the previous brag */
    brags[current++].classList.remove('current');

    /* Work out which brag is next */
    if (brags.length <= current) {
      current = 0;
    }

    /* Wait for animation to end, then animate in next brag */
    setTimeout(function animateInBrag(current) {
      brags[current].classList.add('current');

      /* Continue the sequence */
      setBragTimeout(current);

    }, 500, current);

  }

})();


/**
 * Animate timeline icons when they appear in the viewport
 */
(function doTimelineAnimations() {

  /* Get a NodeList of icons and convert to array for later splicing
     (HT http://stackoverflow.com/questions/3199588/fastest-way-to-convert-javascript-nodelist-to-array) */
  var icons = [];
  var iconNodes = document.querySelectorAll('.timeline .icon:not(.in-view)');
  for (var i = iconNodes.length; i--; icons.unshift(iconNodes[i]));

  /* End if there's no icons */
  if (!icons.length) {
    return;
  }

  /* Listen for frame draws after scrolling or window sizing */
  checkIconsOnRedraw = requestAnimationFrame.bind(null, checkIconsInViewport);
  window.addEventListener('scroll', checkIconsOnRedraw);

  /* Call once after a delay, to animate in any icons already within the
    viewport */
  window.addEventListener('onload', setTimeout.bind(null, checkIconsOnRedraw, 500));


  /**
   * Check for timeline icons that are now in view and so ready to animate
   */
  function checkIconsInViewport() {

    var viewportCenter = (document.documentElement.clientHeight / 2);

    /* Check for icons that should now animate in. Reverse for-loop so we can
       delete items as we go */
    var i, icon, rectTop;
    for (i = icons.length - 1; i >= 0; i--) {

      icon = icons[i];
      rectTop = icon.getBoundingClientRect().top;

      /* Test if the top of the icon is above halfway up the screen */
      if (rectTop < viewportCenter) {

        /* Animate icon in, and remove it from the list of not-animated icons */
        icon.classList.add('in-view');
        icons.splice(i, 1);

      }

    }

    /* If all icons are removed, stop listening for scroll events */
    if (!icons.length) {
      window.removeEventListener('scroll', checkIconsOnRedraw);
    }

  }

})();
