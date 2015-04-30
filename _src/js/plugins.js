// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


/**
 * Detect browser support for translate3d CSS property
 *
 * @author Jeff Falter http://stackoverflow.com/a/11870053
 */
function has3dSupport() {
    var sTranslate3D = "translate3d(0px, 0px, 0px)";

    var eTemp = document.createElement("div");

    eTemp.style.cssText = "  -moz-transform:"    + sTranslate3D +
                          "; -ms-transform:"     + sTranslate3D +
                          "; -o-transform:"      + sTranslate3D +
                          "; -webkit-transform:" + sTranslate3D +
                          "; transform:"         + sTranslate3D;
    var rxTranslate = /translate3d\(0px, 0px, 0px\)/g;
    var asSupport = eTemp.style.cssText.match(rxTranslate);
    var bHasSupport = (asSupport !== null && asSupport.length == 1);

    return bHasSupport;
}


/**
 * Detect iOS
 *
 * Usually needed to turn off scrolling-listening effects, since script
 * execution pauses during momentum scrolling.
 */
function isIOS() {
  return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
}


/**
 * Throttle repeated function calls
 *
 * @author remy http://remysharp.com/2010/07/21/throttling-function-calls/
 */
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}


/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
window.matchMedia || (window.matchMedia = function() {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
