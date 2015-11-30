const babel = require('gulp-babel')
const cssnext = require('cssnext')
const csswring = require('csswring')
const del = require('del')
const connect = require('gulp-connect')
const gulp = require('gulp')
const manifest = require('gulp-manifest')
const minifyHTML = require('gulp-minify-html')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const react = require('gulp-react')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

const buildDestinationPath = 'dist'

gulp.task('connect', () => connect.server({livereload: true}))
gulp.task('clean', () => del([buildDestinationPath + '/**/*.map']))
gulp.task('reload', () => gulp.src(buildDestinationPath).pipe(connect.reload()))
gulp.task('html', () => gulp.src('client/html/index.html')
                            .pipe(minifyHTML())
                            .pipe(gulp.dest(buildDestinationPath)))
gulp.task('jsDev', () => gulp.src('client/js/**/*.js*')
                             .pipe(plumber())
                             .pipe(sourcemaps.init())
                             .pipe(babel())
                             .pipe(react())
                             .pipe(uglify())
                             .pipe(sourcemaps.write())
                             .pipe(gulp.dest(buildDestinationPath + '/js')))
gulp.task('jsProd', () => gulp.src('client/js/**/*.js*')
                              .pipe(babel())
                              .pipe(react())
                              .pipe(uglify())
                              .pipe(gulp.dest(buildDestinationPath + '/js')))
gulp.task('css', () => gulp.src('client/css/style.css')
                           .pipe(plumber())
                           .pipe(postcss([
                             cssnext(),
                             csswring
                           ]))
                           .pipe(gulp.dest(buildDestinationPath)))
gulp.task('manifest', () => gulp.src(buildDestinationPath + '/**/*')
                                .pipe(plumber())
                                .pipe(manifest({
                                  hash: true,
                                  filename: 'app.manifest',
                                  exclude: 'app.manifest',
                                  cache: [
                                    "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
                                    "http://bootswatch.com/slate/bootstrap.min.css",
                                    "http://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.min.js",
                                    "http://cdnjs.cloudflare.com/ajax/libs/ramda/0.14.0/ramda.min.js",
                                    "../jspm_packages/es6-module-loader.js",
                                    "../jspm_packages/system.js",
                                    "../config.js",
                                  ],
                                 }))
                                .pipe(gulp.dest(buildDestinationPath)))
gulp.task('watch', () => {
  gulp.watch('client/html/**/*.html',
             () => runSequence(['html'], 'manifest', 'reload'))
  gulp.watch('client/js/**/*.js*',
             () => runSequence(['jsDev'], 'manifest', 'reload'))
  gulp.watch('client/css/**/*.css',
             () => runSequence(['css'], 'manifest', 'reload'))
})
gulp.task('build', () => runSequence(['clean', 'html', 'jsProd', 'css'],
                                     'manifest'))
gulp.task('default', () => runSequence(['watch', 'html', 'jsDev', 'css'],
                                       'manifest', 'connect'))
