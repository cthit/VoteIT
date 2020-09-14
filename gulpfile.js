'use strict';

var browserify = require('browserify');
var reactify = require('reactify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// add custom browserify options here
var customOpts = {
    entries: ['./src/client/main.js'],
    debug: true
};
var opts = customOpts;
var b = browserify(opts);

// add transformations here
b.transform(reactify);
b.transform("babelify", {presets: ["env", "react"]});

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./public'));
}

function bundleCSS() {
    return gulp.src('src/style.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .on('error', gutil.log.bind(gutil, 'Autoprefixer Error'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public'));
}

exports.default = gulp.parallel(bundle,bundleCSS);
exports.css    = bundleCSS;
exports.js     = bundle;