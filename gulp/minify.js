var cssmin, gulp, rev, uglify, usemin;

gulp = require('gulp');
usemin = require('gulp-usemin');
uglify = require('gulp-uglify');
cssmin = require('gulp-clean-css');
rev = require('gulp-rev');
jslint = require('gulp-jslint');

module.exports = (config) => {
  return function() {
    return gulp.src(config.tmpDir + "/*.html").pipe(usemin({
      css: [cssmin],
      js: [jslint,uglify]
    })).pipe(gulp.dest(config.buildDir));
  };
};
