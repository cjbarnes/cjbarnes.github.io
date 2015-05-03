/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-01-31
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self && !("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    var index = checkTokenAndGetIndex(this, token);
    if (index !== -1) {
      this.splice(index, 1);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  return !result;
};
classListProto.toString = function () {
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}


/*! Picturefill - v2.0.0-beta - 2014-05-02
* http://scottjehl.github.io/picturefill
* Copyright (c) 2014 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
  "use strict";

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
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( w, doc ) {
  // Enable strict mode
  "use strict";

  // If picture is supported, well, that's awesome. Let's get outta here...
  if( w.HTMLPictureElement ){
    return;
  }

  // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
  doc.createElement( "picture" );

  // local object for method references and testing exposure
  var pf = {};

  // namespace
  pf.ns = "picturefill";

  // srcset support test
  pf.srcsetSupported = new w.Image().srcset !== undefined;

  // just a string trim workaround
  pf.trim = function( str ){
    return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
  };

  // just a string endsWith workaround
  pf.endsWith = function( str, suffix ){
    return str.endsWith ? str.endsWith( suffix ) : str.indexOf( suffix, str.length - suffix.length ) !== -1;
  };

  /**
   * Shortcut method for matchMedia ( for easy overriding in tests )
   */
  pf.matchesMedia = function( media ) {
    return w.matchMedia && w.matchMedia( media ).matches;
  };

  /**
   * Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
   */
  pf.getDpr = function() {
    return ( w.devicePixelRatio || 1 );
  };

  /**
   * Get width in css pixel value from a "length" value
   * http://dev.w3.org/csswg/css-values-3/#length-value
   */
pf.getWidthFromLength = function( length ) {
  // If no length was specified, or it is 0, default to `100vw` (per the spec).
  length = length && parseFloat( length ) > 0 ? length : "100vw";

  /**
  * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
  * is injected at the top of the document.
  *
  * TODO: maybe we should put this behind a feature test for `vw`?
  */
  length = length.replace( "vw", "%" );

  // Create a cached element for getting length value widths
  if( !pf.lengthEl ){
    pf.lengthEl = doc.createElement( "div" );
    doc.documentElement.insertBefore( pf.lengthEl, doc.documentElement.firstChild );
  }

  // Positioning styles help prevent padding/margin/width on `html` from throwing calculations off.
  pf.lengthEl.style.cssText = "position: absolute; left: 0; width: " + length + ";";
  // Using offsetWidth to get width from CSS
  return pf.lengthEl.offsetWidth;
};

  // container of supported mime types that one might need to qualify before using
  pf.types =  {};

  // test svg support
  pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');

  // test webp support, only when the markup calls for it
  pf.types[ "image/webp" ] = function(){
    // based on Modernizr's lossless img-webp test
    // note: asynchronous
    var img = new w.Image(),
      type = "image/webp";

    img.onerror = function(){
      pf.types[ type ] = false;
      picturefill();
    };
    img.onload = function(){
      pf.types[ type ] = img.width === 1;
      picturefill();
    };
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  };

  /**
   * Takes a source element and checks if its type attribute is present and if so, supported
   * Note: for type tests that require a async logic,
   * you can define them as a function that'll run only if that type needs to be tested. Just make the test function call picturefill again when it is complete.
   * see the async webp test above for example
   */
  pf.verifyTypeSupport = function( source ){
    var type = source.getAttribute( "type" );
    // if type attribute exists, return test result, otherwise return true
    if( type === null || type === "" ){
      return true;
    }
    else {
      // if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
      if( typeof( pf.types[ type ] ) === "function" ){
        pf.types[ type ]();
        return "pending";
      }
      else {
        return pf.types[ type ];
      }
    }
  };

  /**
  * Parses an individual `size` and returns the length, and optional media query
  */
  pf.parseSize = function( sourceSizeStr ) {
    var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
    return {
      media: match && match[1],
      length: match && match[2]
    };
  };

  /**
   * Takes a string of sizes and returns the width in pixels as a number
   */
  pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
    // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
    //                            or (min-width:30em) calc(30% - 15px)
    var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
      winningLength;

    for ( var i=0, len=sourceSizeList.length; i < len; i++ ) {
      // Match <media-condition>? length, ie ( min-width: 50em ) 100%
      var sourceSize = sourceSizeList[ i ],
        // Split "( min-width: 50em ) 100%" into separate strings
        parsedSize = pf.parseSize( sourceSize ),
        length = parsedSize.length,
        media = parsedSize.media;

      if ( !length ) {
          continue;
      }
      if ( !media || pf.matchesMedia( media ) ) {
        // if there is no media query or it matches, choose this as our winning length
        // and end algorithm
        winningLength = length;
        break;
      }
    }

    // pass the length to a method that can properly determine length
    // in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
    return pf.getWidthFromLength( winningLength );
  };

  /**
   * Takes a srcset in the form of url/
   * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
   *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
   *     "images/pic-small.png"
   * Get an array of image candidates in the form of
   *      {url: "/foo/bar.png", resolution: 1}
   * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
   * If sizes is specified, resolution is calculated
   */
  pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
    var candidates = pf.trim( srcset ).split( /,\s+/ ),
      widthInCssPixels = sizes ? pf.findWidthFromSourceSize( sizes ) : "100%",
      formattedCandidates = [];

    for ( var i = 0, len = candidates.length; i < len; i++ ) {
      var candidate = candidates[ i ],
        candidateArr = candidate.split( /\s+/ ),
        sizeDescriptor = candidateArr[ 1 ],
        resolution;
      if ( sizeDescriptor && ( sizeDescriptor.slice( -1 ) === "w" || sizeDescriptor.slice( -1 ) === "x" ) ) {
        sizeDescriptor = sizeDescriptor.slice( 0, -1 );
      }
      if ( sizes ) {
        // get the dpr by taking the length / width in css pixels
        resolution = parseFloat( ( parseInt( sizeDescriptor, 10 ) / widthInCssPixels ) );
      } else {
        // get the dpr by grabbing the value of Nx
        resolution = sizeDescriptor ? parseFloat( sizeDescriptor, 10 ) : 1;
      }

      var formattedCandidate = {
        url: candidateArr[ 0 ],
        resolution: resolution
      };
      formattedCandidates.push( formattedCandidate );
    }
    return formattedCandidates;
  };

  /*
   * if it's an img element and it has a srcset property,
   * we need to remove the attribute so we can manipulate src
   * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
   * this moves srcset's value to memory for later use and removes the attr
   */
  pf.dodgeSrcset = function( img ){
    if( img.srcset ){
      img[ pf.ns ].srcset = img.srcset;
      img.removeAttribute( "srcset" );
    }
  };

  /*
   * Accept a source or img element and process its srcset and sizes attrs
   */
  pf.processSourceSet = function( el ) {
    var srcset = el.getAttribute( "srcset" ),
      sizes = el.getAttribute( "sizes" ),
      candidates = [];

    // if it's an img element, use the cached srcset property (defined or not)
    if( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ){
      srcset = el[ pf.ns ].srcset;
    }

    if( srcset ) {
      candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
    }
    return candidates;
  };

  pf.applyBestCandidate = function( candidates, picImg ) {
    var candidate,
      length,
      bestCandidate;

    candidates.sort( pf.ascendingSort );

    length = candidates.length;
    bestCandidate = candidates[ length - 1 ];

    for ( var l=0; l < length; l++ ) {
      candidate = candidates[ l ];
      if ( candidate.resolution >= pf.getDpr() ) {
        bestCandidate = candidate;
        break;
      }
    }

    if ( !pf.endsWith( picImg.src, bestCandidate.url ) ) {
      picImg.src = bestCandidate.url;
      // currentSrc attribute and property to match
      // http://picture.responsiveimages.org/#the-img-element
      picImg.currentSrc = picImg.src;
    }
  };

  pf.ascendingSort = function( a, b ) {
    return a.resolution - b.resolution;
  };

  /*
   * In IE9, <source> elements get removed if they aren"t children of
   * video elements. Thus, we conditionally wrap source elements
   * using <!--[if IE 9]><video style="display: none;"><![endif]-->
   * and must account for that here by moving those source elements
   * back into the picture element.
   */
  pf.removeVideoShim = function( picture ){
    var videos = picture.getElementsByTagName( "video" );
    if ( videos.length ) {
      var video = videos[ 0 ],
        vsources = video.getElementsByTagName( "source" );
      while ( vsources.length ) {
        picture.insertBefore( vsources[ 0 ], video );
      }
      // Remove the video element once we're finished removing its children
      video.parentNode.removeChild( video );
    }
  };

  /*
   * Find all picture elements and,
   * in browsers that don't natively support srcset, find all img elements
   * with srcset attrs that don't have picture parents
   */
  pf.getAllElements = function() {
    var pictures = doc.getElementsByTagName( "picture" ),
      elems = [],
      imgs = doc.getElementsByTagName( "img" );

    for ( var h = 0, len = pictures.length + imgs.length; h < len; h++ ) {
      if ( h < pictures.length ){
        elems[ h ] = pictures[ h ];
      }
      else {
        var currImg = imgs[ h - pictures.length ];

        if ( currImg.parentNode.nodeName.toUpperCase() !== "PICTURE" &&
          ( ( pf.srcsetSupported && currImg.getAttribute( "sizes" ) ) ||
          currImg.getAttribute( "srcset" ) !== null ) ) {
            elems.push( currImg );
        }
      }
    }
    return elems;
  };

  pf.getMatch = function( picture ) {
    var sources = picture.childNodes,
      match;

    // Go through each child, and if they have media queries, evaluate them
    for ( var j=0, slen = sources.length; j < slen; j++ ) {
      var source = sources[ j ];

      // ignore non-element nodes
      if( source.nodeType !== 1 ){
        continue;
      }

      // Hitting an `img` element stops the search for `sources`.
      // If no previous `source` matches, the `img` itself is evaluated later.
      if( source.nodeName.toUpperCase() === "IMG" ) {
        return match;
      }

      // ignore non-`source` nodes
      if( source.nodeName.toUpperCase() !== "SOURCE" ){
        continue;
      }

      var media = source.getAttribute( "media" );

      // if source does not have a srcset attribute, skip
      if ( !source.getAttribute( "srcset" ) ) {
        continue;
      }

      // if there"s no media specified, OR w.matchMedia is supported
      if( ( !media || pf.matchesMedia( media ) ) ){
        var typeSupported = pf.verifyTypeSupport( source );

        if( typeSupported === true ){
          match = source;
          break;
        } else if( typeSupported === "pending" ){
          return false;
        }
      }
    }

    return match;
  };

  function picturefill( options ) {
    var elements,
      element,
      elemType,
      firstMatch,
      candidates,
      picImg;

    options = options || {};
    elements = options.elements || pf.getAllElements();

    // Loop through all elements
    for ( var i=0, plen = elements.length; i < plen; i++ ) {
      element = elements[ i ];
      elemType = element.nodeName.toUpperCase();
      firstMatch = undefined;
      candidates = undefined;
      picImg = undefined;

      // expando for caching data on the img
      if( !element[ pf.ns ] ){
        element[ pf.ns ] = {};
      }

      // if the element has already been evaluated, skip it
      // unless `options.force` is set to true ( this, for example,
      // is set to true when running `picturefill` on `resize` ).
      if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
        continue;
      }

      // if element is a picture element
      if( elemType === "PICTURE" ){

        // IE9 video workaround
        pf.removeVideoShim( element );

        // return the first match which might undefined
        // returns false if there is a pending source
        // TODO the return type here is brutal, cleanup
        firstMatch = pf.getMatch( element );

        // if any sources are pending in this picture due to async type test(s)
        // remove the evaluated attr and skip for now ( the pending test will
        // rerun picturefill on this element when complete)
        if( firstMatch === false ) {
          continue;
        }

        // Find any existing img element in the picture element
        picImg = element.getElementsByTagName( "img" )[ 0 ];
      } else {
        // if it's an img element
        firstMatch = undefined;
        picImg = element;
      }

      if( picImg ) {

        // expando for caching data on the img
        if( !picImg[ pf.ns ] ){
          picImg[ pf.ns ] = {};
        }

        // Cache and remove `srcset` if present and we’re going to be doing `sizes`/`picture` polyfilling to it.
        if( picImg.srcset && ( elemType === "PICTURE" || picImg.getAttribute( "sizes" ) ) ){
          pf.dodgeSrcset( picImg );
        }

        if ( firstMatch ) {
          candidates = pf.processSourceSet( firstMatch );
          pf.applyBestCandidate( candidates, picImg );
        } else {
          // No sources matched, so we’re down to processing the inner `img` as a source.
          candidates = pf.processSourceSet( picImg );

          if( picImg.srcset === undefined || picImg.getAttribute( "sizes" ) ) {
            // Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
            pf.applyBestCandidate( candidates, picImg );
          } // Else, resolution-only `srcset` is supported natively.
        }

        // set evaluated to true to avoid unnecessary reparsing
        element[ pf.ns ].evaluated = true;
      }
    }
  }

  /**
   * Sets up picture polyfill by polling the document and running
   * the polyfill every 250ms until the document is ready.
   * Also attaches picturefill on resize
   */
  function runPicturefill() {
    picturefill();
    var intervalId = setInterval( function(){
      // When the document has finished loading, stop checking for new images
      // https://github.com/ded/domready/blob/master/ready.js#L15
      w.picturefill();
      if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
        clearInterval( intervalId );
        return;
      }
    }, 250 );
    if( w.addEventListener ){
      var resizeThrottle;
      w.addEventListener( "resize", function() {
        w.clearTimeout( resizeThrottle );
        resizeThrottle = w.setTimeout( function(){
          picturefill({ reevaluate: true });
        }, 60 );
      }, false );
    }
  }

  runPicturefill();

  /* expose methods for testing */
  picturefill._ = pf;

  /* expose picturefill */
  if ( typeof module === "object" && typeof module.exports === "object" ){
    // CommonJS, just export
    module.exports = picturefill;
  }
  else if( typeof define === "object" && define.amd ){
    // AMD support
    define( function(){ return picturefill; } );
  }
  else if( typeof w === "object" ){
    // If no AMD and we are in the browser, attach to window
    w.picturefill = picturefill;
  }

} )( this, this.document );


/**
 * Deferred webfont loading used by Smashing Magazine
 *
 * @author Horia Dragomir https://gist.github.com/hdragomir
 */
(function () {
  "use strict";
  // once cached, the css file is stored on the client forever unless
  // the URL below is changed. Any change will invalidate the cache
  var css_href = '/css/aleo-font.min.css';
  // a simple event handler wrapper
  function on(el, ev, callback) {
    if (el.addEventListener) {
      el.addEventListener(ev, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + ev, callback);
    }
  }

  // if we have the fonts in localStorage or if we've cached them using the native browser cache
  if ((window.localStorage && localStorage.font_css_cache) || document.cookie.indexOf('font_css_cache') > -1){
    // just use the cached version
    injectFontsStylesheet();
  } else {
   // otherwise, don't block the loading of the page; wait until it's done.
    on(window, "load", injectFontsStylesheet);
  }

  // quick way to determine whether a css file has been cached locally
  function fileIsCached(href) {
    return window.localStorage && localStorage.font_css_cache && (localStorage.font_css_cache_file === href);
  }

  // time to get the actual css file
  function injectFontsStylesheet() {
   // if this is an older browser
    if (!window.localStorage || !window.XMLHttpRequest) {
      var stylesheet = document.createElement('link');
      stylesheet.href = css_href;
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(stylesheet);
      // just use the native browser cache
      // this requires a good expires header on the server
      document.cookie = "font_css_cache";

    // if this isn't an old browser
    } else {
       // use the cached version if we already have it
      if (fileIsCached(css_href)) {
        injectRawStyle(localStorage.font_css_cache);
      // otherwise, load it with ajax
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", css_href, true);
        on(xhr, 'load', function () {
          if (xhr.readyState === 4) {
            // once we have the content, quickly inject the css rules
            injectRawStyle(xhr.responseText);
            // and cache the text content for further use
            // notice that this overwrites anything that might have already been previously cached
            localStorage.font_css_cache = xhr.responseText;
            localStorage.font_css_cache_file = css_href;
          }
        });
        xhr.send();
      }
    }
  }

  // this is the simple utitily that injects the cached or loaded css text
  function injectRawStyle(text) {
    var style = document.createElement('style');
    style.innerHTML = text;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

}());


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
        rectTop = illus.getBoundingClientRect().top;

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
