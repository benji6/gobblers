const babel = require('gulp-babel');
const cssnext = require('cssnext');
const csswring = require('csswring');
const del = require('del');
const connect = require('gulp-connect');
const gulp = require('gulp');
const manifest = require('gulp-manifest');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const react = require('gulp-react');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const buildDestinationPath = 'dist';

gulp.task('connect', function () {
  return connect.server({livereload: true});
});

gulp.task('clean', function () {
  return del([
    buildDestinationPath + '/**/*.map',
  ]);
});

gulp.task('reload', function () {
  return gulp.src(buildDestinationPath).pipe(connect.reload());
});

gulp.task('html', function () {
  return gulp.src('client/html/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('jsDev', function () {
  return gulp.src('client/js/**/*.js*')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(react())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildDestinationPath + '/js'));
});

gulp.task('jsProd', function () {
  return gulp.src('client/js/**/*.js*')
    .pipe(babel())
    .pipe(react())
    .pipe(uglify())
    .pipe(gulp.dest(buildDestinationPath + '/js'));
});

gulp.task('css', function () {
  return gulp.src('client/css/style.css')
    .pipe(plumber())
    .pipe(postcss([
      cssnext(),
      csswring
    ]))
    .pipe(gulp.dest('dist'));
});

gulp.task('manifest', function () {
  return gulp.src(buildDestinationPath + '/**/*')
    .pipe(plumber())
    .pipe(manifest({
      hash: true,
      filename: 'app.manifest',
      exclude: 'app.manifest',
      cache: [
        "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
        "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css",
        "http://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.min.js",
      ],
     }))
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('watch', function () {
  gulp.watch('client/html/**/*.html', function () {
    return runSequence(['html'], 'manifest', 'reload');
  });
  gulp.watch('client/js/**/*.js*', function () {
    return runSequence(['jsDev'], 'manifest', 'reload');
  });
  gulp.watch('client/css/**/*.css', function () {
    return runSequence(['css'], 'manifest', 'reload');
  });
});

gulp.task('build', function () {
  return runSequence(['clean', 'html', 'jsProd', 'css'], 'manifest');
});

gulp.task('default', function () {
  return runSequence(['watch', 'html', 'jsDev', 'css'], 'manifest', 'connect');
});
