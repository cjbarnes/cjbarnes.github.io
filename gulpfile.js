/* jshint node: true  */
'use strict';

var browserSync  = require('browser-sync');
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
    sassAll: '_src/sass/**/*.scss',
    sassIncludes: '_src/sass/sass-includes/*.scss',
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
    jekyll: '_site/'
  }
};

// Don't output success notifications to stdout. Just make them notifications.
notify.logLevel(1);

// Notification sound to play.
var errorSound = 'Pop';

// BrowserSync settings object.
var browserConfig = {
  server: {
    baseDir: '_site/'
  },
  // Watch for changes to the built site.
  files: '_site/**/*.*',
  logFileChanges: false
};

/**
 * Reusable function for compiling Sass.
 * @param {String} path Property name for the paths used in this task.
 * @return {Stream} The gulp stream.
 */
function stylesTask(path) {
  return gulp.src(paths.src[path])
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(notify.onError({
      title: 'Error compiling <%= error.fileName %>',
      message: 'Styles Error: <%= error.message %>',
      sound: errorSound
    })))
    .pipe(sourcemaps.init())
    // Compile Sass.
    .pipe(sass())
    // Automated support for old browsers.
    .pipe(autoprefixer({
      browsers: [
        '> 3% in GB',
        'last 2 versions',
        'Firefox ESR',
        'Opera 12.1',
        'ie >= 8'
      ]
    }))
    // Enforce the preferred CSS property order and format.
    .pipe(csscomb())
    // Output non-minified version.
    .pipe(gulp.dest(paths.dest[path]))
    // Minify.
    .pipe(minifyCSS())
    // Output minified version.
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest[path]));
}

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
    // Concatenate the different JavaScript files.
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
 * Compile sitewide Sass.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-stylesheets', function () {
  return stylesTask('sass');
});

/**
 * Compile single-page Sass to be inserted into style elements.
 * @return {Stream} The gulp stream.
 */
gulp.task('_compile-style-elements', function () {
  return stylesTask('sassIncludes');
});

/**
 * Run a Jekyll build process.
 * @param {Function} cb Callback function.
 */
gulp.task('build', function (cb) {
  var args = [
    'exec',
    'jekyll',
    'build',
    '-q',
    '--config',
    '_config_dev.yml,_config.yml'
  ];

  spawn('bundle', args, { stdio: 'inherit' })
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
 * Compile sitewide stylesheets and then rebuild site.
 * Not used by default, but is available for manual triggering on the CLI.
 */
gulp.task('stylesheets', function () {
  runSequence(
    '_compile-stylesheets',
    'build'
  );
});

/**
 * Compile single-page styles and then rebuild site.
 * Not used by default, but is available for manual triggering on the CLI.
 */
gulp.task('style-elements', function () {
  runSequence(
    '_compile-style-elements',
    'build'
  );
});

/**
 * Compile all styles and then rebuild site.
 */
gulp.task('styles', function () {
  runSequence(
    ['_compile-stylesheets', '_compile-style-elements'],
    'build'
  );
});

/**
 * Compile JavaScript and then rebuild site.
 */
gulp.task('scripts', function () {
  runSequence(
    '_compile-scripts',
    'build'
  );
});

/**
 * Initialize the BrowserSync server and file watching.
 */
gulp.task('start-browser-sync', function () {
  if (!browserSync.active) {
    browserSync(browserConfig);
  }
});

/**
 * Build everything.
 */
gulp.task('all', function () {
  runSequence(
    ['_compile-stylesheets', '_compile-style-elements', '_compile-scripts'],
    'build',
    'start-browser-sync'
  );
});

/**
 * Build everything and then watch for changes.
 */
gulp.task('default', ['all'], function () {

  // Watch for source file changes.
  gulp.watch(paths.src.js, ['scripts']);
  gulp.watch(paths.src.sassAll, ['styles']);
  gulp.watch(paths.src.jekyll, ['build']);

});
