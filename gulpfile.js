var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var HTML_PATH = "src/html/index.html";
var JS_PATH = "src/js/main.js";
var SASS_PATH = "src/sass/style.scss";
var DIST_PATH = "dist";

gulp.task("html", function () {
  gulp.src(HTML_PATH)
    .pipe(minifyHTML())
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task("js", function () {
  var bundler = watchify(browserify(JS_PATH, watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task("sass", function () {
  gulp.src(SASS_PATH)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task("watch", function () {
  gulp.start("js", "html", "sass");
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch(HTML_PATH, ["html"]);
  gulp.watch(SASS_PATH, ["sass"]);
});

gulp.task("build", ["js", "html", "sass"]);
gulp.task("default", ["watch"]);
