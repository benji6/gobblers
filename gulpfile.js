const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const cssnext = require('cssnext');
const csswring = require('csswring');
const connect = require('gulp-connect');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const R = require('ramda');
const reactify = require('reactify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const htmlPath = "src/html/index.html";
const jsPath = "src/js/main.js";
const distPath = "dist";

gulp.task("connect", function () {
  connect.server({livereload: true});
});

gulp.task("reload", function () {
  gulp.src(distPath).pipe(connect.reload());
});

gulp.task("html", function () {
  gulp.src(htmlPath)
    .pipe(minifyHTML())
    .pipe(gulp.dest(distPath));
});

gulp.task("jsDev", function () {
  watchify(browserify(jsPath, R.assoc("debug", true, watchify.args)))
    .transform(reactify)
    .transform(babelify)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
});

gulp.task("jsProd", function () {
  browserify({entries: jsPath})
    .transform(reactify)
    .transform(babelify)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task('css', function () {
  return gulp.src("src/css/style.css")
    .pipe(plumber())
    .pipe(postcss([
      cssnext(),
      csswring
    ]))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
  gulp.start("jsDev", "css", "html", "connect");
  gulp.watch("src/js/**/*.js*", ["jsDev"]);
  gulp.watch(htmlPath, ["html"]);
  gulp.watch("src/css/**/*.css", ["css"]);
  gulp.watch(distPath + "/*", ["reload"]);
});

gulp.task("build", ["jsProd", "css", "html"]);
gulp.task("default", ["watch"]);
