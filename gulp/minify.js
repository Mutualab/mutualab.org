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
  return ()=> {
    return gulp.src(config.tmpDir + "/*.html")
    .pipe(usemin({
      css: [(()=>{ return cssmin() })],
      js:  [(()=>{ return uglify() })],
      html:[htmlmin],
      inlineJs:  [uglify],
    }))
    .pipe(changed(config.buildDir))
    .pipe(gulp.dest(config.buildDir));
  };
};
