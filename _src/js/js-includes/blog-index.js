(function () {
  'use strict';

  /**
   * Create the post search/filter area.
   */
  function doPostsFiltering() {

    /**
     * Reusable function that uses document.querySelectorAll() but returns an
     * Array (which allows use of forEach() etc) instead of a NodeList.
     * @param {String} selector Valid DOM selector for querySelectorAll().
     * @return {Array} Array of elements matching the selector.
     */
    function elementsArray(selector) {
      var nodeList = document.querySelectorAll(selector);
      return Array.prototype.slice.call(nodeList);
    }

    /**
     * Reusable function to remove the active-filter class from a sidebar
     * section. Designed for use in `Array.prototype.forEach` loops.
     * @param {Element} current Element to remove the class from
     */
    function removeFilterActiveClass(current) {
      current.classList.remove('sidebar-filter-active');
    }

    /**
     * Replace an element's HTML with the minilisting Ajax response.
     * @this {XMLHttpRequest}
     * @param {Element} current Current element being processed in the array.
     */
    function outputMiniListingHtml(current) {
      current.innerHTML = this.response || this.responseText;
    }

    /**
     * Change which filter/search section is being shown.
     * @since 1.0.0
     * @param {Element} el The button element for the filter to be opened.
     */
    function openFilterBox(el) {

      /* Change which section is shown. */
      var sectionClass = el.getAttribute('data-filter-section');
      if (sectionClass) {
        var wasOpen = document.querySelector('.sidebar-filter-section.open');
        if (wasOpen) {
          /**
           * Remove the active-filter class from sidebar sections.
           * @param {Element} current Element to remove the class from.
           */
          wasOpen.classList.remove('open');
        }
        document.querySelector('.' + sectionClass).classList.add('open');

        /* Deactivate the previous filter button. */
        var wasActive = filterButtonBar.querySelector('b');
        if (wasActive) {
          wasActive.outerHTML = wasActive.outerHTML.replace(/<b/, '<a').replace(/<\/b/, '</a');
        }

        /* Activate the new filter button. */
        el.outerHTML = el.outerHTML.replace(/<a/, '<b').replace(/<\/a/, '</b');

        /* Remove existing search/filter results. */
        wasActive = elementsArray('.sidebar-filter-active');
        wasActive.forEach(removeFilterActiveClass);
        style.innerHTML = '';

        /* Focus on the search box if we're switching to search. */
        if ('js-search-section' === sectionClass) {
          document.querySelector('#sidebar-search').focus();
        } else {
          document.querySelector('#sidebar-search').blur();
        }

      }
    }

    /**
     * Run a search.
     * @param {Event} e Event object.
     */
    function doSearch(e) {

      e.preventDefault();

      var searchbox = document.querySelector('#sidebar-search');

      if ('value' in searchbox) {
        var str = searchbox.value.trim().toLowerCase();

        /* Split the search term into quoted phrases and unquoted words. */
        /**
         * Convert search terms of 3+ characters into attribute selectors.
         * @param {String} Search term.
         * @return {String} Attribute selector, or '' if the search term is too
         *                  short.
         */
        var attrSelectors = str.match(/(".*?"|[\w']*)/g).map(function getSearchTermAttribute(term) {

          term = term.replace(/"/g, '');

          /* Search term must be 3 or more characters. */
          if (2 < term.length) {
            return '[data-fulltext*="' + term + '"]';
          } else {
            return '';
          }
        });

        var attrStr = attrSelectors.join('');
        if (attrStr) {
          style.innerHTML = '.filter-minilisting-item' + attrStr + ' { display: block; counter-increment: results; }';
        } else {
          style.innerHTML = '';
        }

      }

    }

    /* Get the empty containers for the minilisting to be loaded into. */
    var minilistingWrappers = elementsArray('.js-posts-minilist');
    if (minilistingWrappers.length) {

      /* Load styling for sidebar contents. */
      var link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.href = '/css/blog-index-sidebar.min.css';
      document.head.appendChild(link);

      /* Ajax-get the HTML for the list of posts. */
      var request = new XMLHttpRequest();
      request.open('GET', '/posts-data/', true);
      /**
       * Insert the Ajax-loaded search results listing into the DOM.
       * @this {XMLHttpRequest} The Ajax request object.
       */
      request.onreadystatechange = function gotMiniListingHtml() {
        if (4 === this.readyState) {
          if ((200 <= this.status) && (400 > this.status)) {
            console.dir(this);
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

      /* Find the button bar. */
      var filterButtonBar = document.querySelector('.js-filter-switcher');

      /* Select one of the filters on load, *if* 2-column layout is used. */
      if (window.matchMedia('(min-width: 940px)').matches) {
        openFilterBox(document.querySelector('.js-languages-filter'));
      }

      /* Handle user changing of filter type. */
      /**
       * Change the visible filter/search section based on user click.
       * @param {Event} e Event object.
       */
      filterButtonBar.addEventListener('click', function changeFilterBox(e) {
        var el = e.target;
        /* Find the a element that was clicked. */
        while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
          el = el.parentNode;
        }
        openFilterBox(el);
      });

      /* Handle language link clicks. */
      var languagesList = document.querySelector('.languages-listing');
      /**
       * Update which search/filter results are being displayed.
       * @param {Event} e Event object.
       */
      languagesList.addEventListener('click', function applyLanguageFilter(e) {

        /* Find the a element that has our data attribute. */
        var el = e.target;
        while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
          el = el.parentNode;
        }

        /* Use CSS to filter down the list of posts. Ignore non-link clicks. */
        var language = el.getAttribute('data-language');
        if (language) {
          style.innerHTML = '.filter-minilisting-item[data-languages*="|' + language + '|"] { display: block; counter-increment: results; }';

          /* Highlight the active filter only. */
          var wasActive = elementsArray('.sidebar-filter-active');
          wasActive.forEach(removeFilterActiveClass);
          el.classList.add('sidebar-filter-active');
        }

      });

      /* Handle format link clicks. */
      var formatsList = document.querySelector('.formats-listing');
      /**
       * Update which search/filter results are being displayed.
       * @param {Event} e Event object.
       */
      formatsList.addEventListener('click', function applyFormatFilter(e) {

        /* Find the a element that has our data attribute. */
        var el = e.target;
        while (('A' !== el.tagName) && ('BODY' !== el.tagName)) {
          el = el.parentNode;
        }

        /* Use CSS to filter down the list of posts. Ignore non-link clicks. */
        var format = el.getAttribute('data-format');
        if (format) {
          style.innerHTML = '.filter-minilisting-item[data-format="' + format + '"] { display: block; counter-increment: results; }';

          /* Highlight the active filter only. */
          var wasActive = elementsArray('.sidebar-filter-active');
          wasActive.forEach(removeFilterActiveClass);
          el.classList.add('sidebar-filter-active');
        }

      });

      /* Handle search form. */
      var searchForms = elementsArray('.search-form');
      /**
       * Add submit event listener to search forms.
       * @param {Element} current Search form element.
       */
      searchForms.forEach(function(current) {
        current.addEventListener('submit', doSearch);
      });
      document.querySelector('#sidebar-search').addEventListener('input', doSearch);

    }

  }

  // Check for minimum level of JS support.
  if (('addEventListener' in window) && ('querySelector' in document)) {

    // Register initializing functions with the DOM ready event.
    if ('loading' !== document.readyState) {
      doPostsFiltering();
    } else {
      document.addEventListener('DOMContentLoaded', doPostsFiltering);
    }

  }

})();
