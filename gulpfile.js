/**
 * Build process for cjbarnes.co.uk.
 *
 * Tasks:
 * - default            (calls 'all' and starts watching)
 * - all                (calls compilers, 'build', 'start-browser-sync')
 * - styles             (calls Sass compilers, 'build')
 * - script-files       (calls sitewide JavaScript compiler, 'build')
 * - script-elements    (calls single-page JavaScript compiler, 'build')
 * - build              (runs Jekyll build process)
 * - start-browser-sync (starts BrowserSync server)
 */
/* jshint node: true  */
'use strict';

var bs           = require('browser-sync').create();
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var csscomb      = require('gulp-csscomb');
var minifyCSS    = require('gulp-minify-css');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var runSequence  = require('run-sequence');
var spawn        = require('child_process').spawn;

// Don't output success notifications to stdout. Just make them notifications.
notify.logLevel(1);

// File paths to watch.
var paths = {
  // File paths to watch.
  src: {
    sass: '_src/sass/*.scss',
    js: [
      '_src/js/vendor/*.js',
      '_src/js/plugins.js',
      '_src/js/main.js'
    ],
    sassIncludes: '_src/sass/sass-includes/*.scss',
    jsIncludes: '_src/js/js-includes/*.js',
    sassAll: '_src/sass/**/*.scss',
    jekyll: [
      '*.html',
      '*.md',
      '_data/**/*.*',
      '_drafts/**/*.*',
      '_includes/*.*',
      '_layouts/**/*.*',
      '_pages/**/*.*',
      '_posts/**/*.*',
      'font/**/*.*',
      'img/**/*.*',
      'blog/**/*.*'
    ]
  },
  // File paths to output to.
  dest: {
    sass: 'css/',
    js: 'js/',
    sassIncludes: '_includes/css',
    jsIncludes: '_includes/js',
    jekyll: '_site/'
  }
};

// Autoprefixer browser support options.
var autoprefixerOptions = {
  browsers: [
    '> 3% in GB',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1',
    'ie >= 9'
  ]
};

// Notification sound to play.
var errorSound = 'Pop';

// BrowserSync settings object.
var browserConfig = {
  server: {
    baseDir: '_site/'
  }
};

/**
 * Compile sitewide scripts.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-scripts', function () {
  return gulp.src(paths.src.js)
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(notify.onError({
      title: 'Error compiling <%= error.fileName %>',
      message: 'Script Error: <%= error.message %>',
      sound: errorSound
    })))
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js', {
      newLine: '\n\n'
    }))
    // Output concatenated version.
    .pipe(gulp.dest(paths.dest.js))
    // Minify (keeping any @license comments).
    .pipe(uglify({
      preserveComments: 'some'
    }))
    // Output minified version.
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.js));
});

/**
 * Compile single-page JavaScript to be inserted into style elements.
 * This is a shortened version of the _compile-scripts task - no sourcemaps
 * or unminified versions required, and no concatenation - and the destination
 * is different.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-script-elements', function () {
  return gulp.src(paths.src.jsIncludes)
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(notify.onError({
      title: 'Error compiling <%= error.fileName %>',
      message: 'Script Error: <%= error.message %>',
      sound: errorSound
    })))
    // Minify (keeping any @license comments).
    .pipe(uglify({
      preserveComments: 'some'
    }))
    // Output minified version.
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.dest.jsIncludes));
});

/**
 * Compile sitewide Sass.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-stylesheets', function () {
  return gulp.src(paths.src.sass)
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(notify.onError({
      title: 'Error compiling <%= error.fileName %>',
      message: 'Styles Error: <%= error.message %>',
      sound: errorSound
    })))
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csscomb())
    // Output non-minified version with original property order.
    .pipe(gulp.dest(paths.dest.sass))
    // Minify.
    .pipe(minifyCSS({
      advanced: false // prevent mangling of source order by combining selectors
    }))
    // Output minified version.
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.dest.sass));
});

/**
 * Compile single-page Sass to be inserted into style elements.
 * This is a shortened version of the _compile-stylesheets task - no sourcemaps
 * or unminified versions required - and the destination is different.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-style-elements', function () {
  return gulp.src(paths.src.sassIncludes)
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(notify.onError({
      title: 'Error compiling <%= error.fileName %>',
      message: 'Styles Error: <%= error.message %>',
      sound: errorSound
    })))
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csscomb())
    // Minify.
    .pipe(minifyCSS())
    // Output minified version.
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.dest.sassIncludes));
});

/**
 * Run a Jekyll build process.
 * @param {Function} cb Callback function.
 */
gulp.task('build', function (cb) {
  var args = [
    'build',
    '-q',
    '--config',
    '_config.yml,_config_dev.yml'
  ];

  spawn('jekyll', args, { stdio: 'inherit' })
    .on('error', notify.onError({
      title: 'Error building site',
      message: 'Build Error: <%= error.message %>',
      sound: errorSound
    }))
    .on('close', function (code) {
      // 0 = success, 1+ = failure.
      if (0 === code) {
        cb();
      } else {
        this.emit('error', new Error('Jekyll build failed with code ' + code));
        cb();
      }
    });
});

/**
 * Compile all styles and then rebuild site.
 */
gulp.task('styles', function () {
  runSequence(
    ['_compile-stylesheets', '_compile-style-elements'],
    'reload'
  );
});

/**
 * Compile sitewide JavaScript and then rebuild site.
 */
gulp.task('script-files', function () {
  runSequence(
    '_compile-scripts',
    'reload'
  );
});

/**
 * Compile single-file JavaScript and then rebuild site.
 */
gulp.task('script-elements', function () {
  runSequence(
    '_compile-script-elements',
    'reload'
  );
});

/**
 * Initialize the BrowserSync server and file watching.
 */
gulp.task('serve', function () {
  bs.init(browserConfig);
});

/**
 * Manually trigger a BrowserSync refresh after completed build process.
 */
gulp.task('reload', ['build'], function () {
  bs.reload();
});

/**
 * Build everything.
 */
gulp.task('all', function () {
  runSequence(
    [
      '_compile-stylesheets',
      '_compile-style-elements',
      '_compile-scripts',
      '_compile-script-elements'
    ],
    'build',
    'serve'
  );
});

/**
 * Build everything and then watch for changes.
 */
gulp.task('default', ['all'], function () {

  // Watch for source file changes.
  gulp.watch(paths.src.js, ['script-files']);
  gulp.watch(paths.src.jsIncludes, ['script-elements']);
  gulp.watch(paths.src.sassAll, ['styles']);
  gulp.watch(paths.src.jekyll, ['reload']);

});
