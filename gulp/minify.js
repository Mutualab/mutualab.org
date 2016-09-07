var cssmin, gulp, rev, uglify, usemin, changed;

gulp = require('gulp');
usemin = require('gulp-usemin');
uglify = require('gulp-uglify');
cssmin = require('gulp-clean-css');
htmlmin = require('gulp-minify-html');
rev = require('gulp-rev');
jslint = require('gulp-jslint');
changed = require('gulp-changed')

module.exports = (config) => {
  return function() {
    return gulp.src(config.tmpDir + "/*.html").pipe(usemin({
      css: [cssmin],
      js:  [uglify],
      html:[htmlmin],
      inlineJs:  [uglify],
    })).pipe(gulp.dest(config.buildDir));
  };
};
