/* jshint node: true  */
'use strict';

var async        = require('async');
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var csscomb      = require('gulp-csscomb');
var minifyCSS    = require('gulp-minify-css');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var notifier     = require('node-notifier');
var spawn        = require('child_process').spawn;

// File paths.
var JSPATH = {
  src:  '_src/js/',
  dest: 'js/'
};
var CSSPATH = {
  src:  '_src/sass/',
  dest: 'css/'
};

// JavaScript source files (in compilation order).
var scripts = [
  JSPATH.src + 'vendor/*.js',
  JSPATH.src + 'plugins.js',
  JSPATH.src + 'main.js'
];

/**
 * Process the JavaScript files and report the results.
 * @param {Function} callback The results callback for this task.
 */
function buildScripts(callback) {

  gulp.src(scripts)
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(function(err) {
      callback(err, 'Scripts');
    }))
    .pipe(sourcemaps.init())
    // Concatenate the different JavaScript files.
    .pipe(concat('scripts.js', {
      newLine: '\n\n'
    }))
    // Output concatenated version.
    .pipe(gulp.dest(JSPATH.dest))
    // Minify (keeping any @license comments).
    .pipe(uglify({
      preserveComments: 'some'
    }))
    // Output minified version.
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(JSPATH.dest))
    // Success.
    //.pipe(plumber.stop())
    .on('end', function() {
      callback(null, 'Scripts');
    });

}

/**
 * Process the Sass files and report the results.
 * @param {Function} callback The results callback for this task.
 */
function buildStyles(callback) {

  gulp.src(CSSPATH.src + '**/*.scss')
    // Error handling: on error, pass error object to async callback.
    .pipe(plumber(function(err) {
      callback(err, 'Styles');
    }))
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
    .pipe(gulp.dest(CSSPATH.dest))
    // Minify.
    .pipe(minifyCSS())
    // Output minified version.
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CSSPATH.dest))
    // Success.
    //.pipe(plumber.stop())
    .on('end', function() {
      callback(null, 'Styles');
    });
}

/**
 * Results callback for scripts and styles compilation. Notifies the user of
 * success/failure using node-notifier module.
 * @param {Object|Null}  err   Error object, or Null on success.
 * @param {Array|String} tasks Task names passed as compilation result messages.
 */
function buildResult(err, tasks) {
  var msgTitle = 'cjbarnes.github.io';
  var errorSound = 'Tink';
  var tasksString = tasks;
  if (Array.isArray(tasks)) {
    // Remove empty array items and convert to string.
    tasksString = tasks.filter(function(el) { return el; }).join(', ');
  } else {
    tasks = [tasks];
  }

  if (err) {
    var msg = '[' + err.plugin + ']: ' + err.message;
    notifier.notify({
      title: 'Error compiling ' + msgTitle,
      message: tasksString + ' ' + msg,
      sound: errorSound
    });
    // Make error message more detailed and output to console.
     msg = '\n***' + tasksString + ' Error ' + msg + ' in ' + err.fileName + ' at line ' + err.lineNumber + ' ***';
    console.error(msg);
  } else {
    notifier.notify({
      title: msgTitle,
      message:  tasksString + ' compiled successfully.',
      sound: false
    });
    tasks.forEach(function(task) {
      console.info('\n*** ' + task + ' compiled successfully. ***');
    });
  }
}

/**
 * [afterFirstBuild description]
 * @param {Object|Null}  err     Error object, or Null on success.
 * @param {Array|String} results Task names passed as compilation result
 *                               messages.
 */
function afterFirstBuild(err, results) {
  // Output the usual success/error messages.
  buildResult(err, results);

  // Start running Jekyll server in development mode.
  var args = [ 'exec', 'jekyll', 'serve', '--config', '_config_dev.yml,_config.yml', '-w' ];
  spawn('bundle', args, { stdio: 'inherit' });
}

/**
 * Process both JavaScript and Sass, and report the results together.
 * Called on initial run of gulp default task.
 */
gulp.task('everything', function() {
  async.parallel(
    [buildScripts, buildStyles],
    afterFirstBuild
  );
});

/**
 * Process just the JavaScript files.
 * Called by `gulp.watch()`.
 */
gulp.task('scripts', function() {
  // One task at a time, so no need to use `async.parallel()`.
  buildScripts(buildResult);
});

/**
 * Process just the Sass files.
 * Called by `gulp.watch()`.
 */
gulp.task('styles', function() {
  // One task at a time, so no need to use `async.parallel()`.
  buildStyles(buildResult);
});

/**
 * Compile both scripts and styles, then watch for any changes and recompile as
 * necessary.
 */
gulp.task('default', ['everything'], function() {

  // Watch JavaScript files.
  gulp.watch(JSPATH.src + '**/*.js', ['scripts']);

  // Watch Less files.
  gulp.watch(CSSPATH.src + '**/*.scss', ['styles']);

});
