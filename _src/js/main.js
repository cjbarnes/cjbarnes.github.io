/**
 * Remove 'no-js' flag from DOM, for use in CSS.
 */
(function confirmJavascriptSupport() {

  var html = document.getElementsByTagName('html')[0];
  html.classList.remove('no-js');
  html.classList.add('js');

})();


/**
 * Navigation menu for mobile layout.
 */
(function doMobileNav() {

  /* Variables. */
  var siteNavigationToggle;
  var siteNavigation = document.getElementById('site-navigation');
  var navBar = document.getElementById('navbar');

  /* Create navigation toggle. */
  siteNavigationToggle = document.createElement('button');
  siteNavigationToggle.appendChild(document.createTextNode('menu'));
  siteNavigationToggle.classList.add('nav-menu-toggle');
  siteNavigationToggle.id = 'site-navigation-toggle';
  siteNavigationToggle.onclick = navToggle.bind(siteNavigationToggle);

  /* Update the DOM with the toggle button and the hidden-by-default menu. */
  siteNavigation.parentNode.insertBefore(siteNavigationToggle, siteNavigation);
  navBar.classList.toggle('open');
  navBar.classList.toggle('closed');


  /**
   * Toggles the nav visible/invisible classes.
   */
  function navToggle() {

    /* Class changes. */
    siteNavigationToggle.classList.toggle('active');
    navBar.classList.toggle('open');
    navBar.classList.toggle('closed');

  }

})();


/**
 * Initialize and do parallax effect on illustrations.
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
   * Check for browser support.
   */

  /* 3D translates (don't bother with fallback). */
  if (isIOS() || ! has3dSupport()) {
    return;
  }

  /* Find parallax illustrations */
  illustrations = document.querySelectorAll('.illustration img');
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
  parallaxOnRedraw = requestAnimationFrame.bind(null, parallax);
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
    var rect;
    var levelOfParallax = 4; // Increased after 'featured' article

    for (i = 0, l = numberOfIllustrations; i < l; i++) {

      illus = illustrations[i];
      rectTop = illus.getBoundingClientRect().top;

      /* Ignore if this element is obviously offscreen. */
      if ((rectTop > -1000) && (rectTop < 1600)) {

        /* Apply the transform. */
        illus.style[transformProperty] = 'translate3d(0,'
          + Math.round((-1 * rectTop) / levelOfParallax) + 'px,0)';

      }

      /* Sets stronger parallax effect for the remaining illustrations. */
      levelOfParallax = 8;

    }

  }

})();


/**
 * Animate between 'brags' in the homepage tagline.
 */
(function doHomepageBrags() {

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
   * @param {int} current The array ID of the current brag.
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
 * Adds ids to content subheadings, so they can be linked to.
 */
(function linkifySubheadings() {

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

})();


/**
 * Create the post
 */
(function doPostsFiltering() {

  /**
   * Reusable function that uses document.querySelectorAll() but returns an
   * Array (which allows use of forEach() etc) instead of a NodeList.
   *
   * @param {String} selector Valid DOM selector for querySelectorAll().
   * @return {Array} Array of elements matching the selector.
   */
  function elementsArray(selector) {
    var nodeList = document.querySelectorAll(selector);
    return Array.prototype.slice.call(nodeList);
  }

  /**
   * Replace an element's HTML with the minilisting Ajax response.
   * @this {XMLHttpRequest}
   * @param {Element} current Current element being processed in the array.
   */
  function outputMiniListingHtml(current) {
    current.innerHTML = this.response;
  }

  /**
   * Run a search.
   */
  function doSearch(e) {
    e.preventDefault();

    var searchbox = document.querySelector('#sidebar-search');

    if ('value' in searchbox) {
      var str = searchbox.value.trim().toLowerCase();

      /* Split the search term into quoted phrases and unquoted words. */
      var attrSelectors = str.match(/(".*?"|[\w']*)/g).map(function getSearchTermAttribute(term) {

        term = term.replace(/"/g, '');

        /* Search term must be 3 or more characters. */
        if (2 < term.length) {
          return '[data-fulltext*="' + term + '"]';
        } else {
          return '';
        }
      });


      style.innerHTML = '.minilisting-item' + attrSelectors.join('') + ' { display: block; counter-increment: results; }';

    }
  }

  /* Get the empty containers for the minilisting to be loaded into. */
  var minilistingWrappers = elementsArray('.js-posts-minilist');
  if (minilistingWrappers.length) {

    /* Ajax-get the HTML for the list of posts. */
    var request = new XMLHttpRequest();
    request.open('GET', '/posts-data.html', true);
    request.onreadystatechange = function gotMiniListingHtml() {
      if (4 === this.readyState) {
        if ((200 <= this.status) && (400 > this.status)) {
          /* Output the loaded HTML to the DOM. */
          minilistingWrappers.forEach(outputMiniListingHtml, this);
        }
      }
    };
    request.send();
    request = null;

    /* Prep style element for use in searching and filtering. */
    var style = document.createElement('style');
    document.body.appendChild(style);

    /* Handle changing of filter type. */
    var filterButtonBar = document.querySelector('.js-filter-switcher');
    filterButtonBar.addEventListener('click', function changeFilterBox(e) {

      /* Find the a element that was clicked. */
      var el = e.target;
      while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
        el = el.parentNode;
      }

      /* Change which section is shown. */
      var sectionClass = el.getAttribute('data-filter-section');
      if (sectionClass) {
        var wasOpen = elementsArray('.sidebar-filter-section.open');
        wasOpen.forEach(function removeFilterSectionOpenClass(current) {
          current.classList.remove('open');
        });
        document.querySelector('.' + sectionClass).classList.add('open');

        /* Change which filter button is active. */
        var wasActive = filterButtonBar.querySelector('b');
        wasActive.outerHTML = wasActive.outerHTML.replace(/<b/, '<a').replace(/<\/b/, '</a');
        el.outerHTML = el.outerHTML.replace(/<a/, '<b').replace(/<\/a/, '</b');

        /* Remove existing search/filter results. */
        style.innerHTML = '';

        /* Focus on the search box if we're switching to search. */
        if ('js-search-section' === sectionClass) {
          document.querySelector('#sidebar-search').focus();
        } else {
          document.querySelector('#sidebar-search').blur();
        }

      }

    });

    /* Handle tag clicks. */
    var tagcloud = document.querySelector('.tagcloud');
    tagcloud.addEventListener('click', function applyTagFilter(e) {

      /* Find the a element that has our data attribute. */
      var el = e.target;
      while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
        el = el.parentNode;
      }

      /* Use CSS to filter down the list of posts. Ignore non-link clicks. */
      var tag = el.getAttribute('data-tag');
      if (tag) {
        style.innerHTML = '.minilisting-item[data-tags*="|' + tag + '|"] { display: block; counter-increment: results; }';

        /* Highlight the active filter only. */
        var wasActive = elementsArray('.sidebar-filter-active');
        wasActive.forEach(function removeFilterActiveClass(current) {
          current.classList.remove('sidebar-filter-active');
        });
        el.classList.add('sidebar-filter-active');
      }

    });

    /* Handle language link clicks. */
    var languagesList = document.querySelector('.languages-listing');
    languagesList.addEventListener('click', function applyLanguageFilter(e) {

      /* Find the a element that has our data attribute. */
      var el = e.target;
      while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
        el = el.parentNode;
      }

      /* Use CSS to filter down the list of posts. Ignore non-link clicks. */
      var language = el.getAttribute('data-language');
      if (language) {
        style.innerHTML = '.minilisting-item[data-languages*="|' + language + '|"] { display: block; counter-increment: results; }';

        /* Highlight the active filter only. */
        var wasActive = elementsArray('.sidebar-filter-active');
        wasActive.forEach(function removeFilterActiveClass(current) {
          current.classList.remove('sidebar-filter-active');
        });
        el.classList.add('sidebar-filter-active');
      }

    });

    /* Handle format link clicks. */
    var formatsList = document.querySelector('.formats-listing');
    formatsList.addEventListener('click', function applyFormatFilter(e) {

      /* Find the a element that has our data attribute. */
      var el = e.target;
      while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
        el = el.parentNode;
      }

      /* Use CSS to filter down the list of posts. Ignore non-link clicks. */
      var format = el.getAttribute('data-format');
      if (format) {
        style.innerHTML = '.minilisting-item[data-format="' + format + '"] { display: block; counter-increment: results; }';

        /* Highlight the active filter only. */
        var wasActive = elementsArray('.sidebar-filter-active');
        wasActive.forEach(function removeFilterActiveClass(current) {
          current.classList.remove('sidebar-filter-active');
        });
        el.classList.add('sidebar-filter-active');
      }

    });

    /* Handle search form. */
    var searchForms = elementsArray('.search-form');
    searchForms.forEach(function(current) {
      current.addEventListener('submit', doSearch);
    });
    document.querySelector('#sidebar-search').addEventListener('input', doSearch);

  }

})();
