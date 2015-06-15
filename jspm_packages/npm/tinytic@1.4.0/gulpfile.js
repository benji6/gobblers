/* */ 
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');

gulp.task("js", function () {
  return gulp.src("tinytic.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename("tinytic.min.js"))
    .pipe(gulp.dest("./"));
});

gulp.task("watch", function () {
  gulp.watch("tinytic.js", ["js"]);
});

gulp.task("build", ["js"]);

gulp.task("default", ["js", "watch"]);
