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
