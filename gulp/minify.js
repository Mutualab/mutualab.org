var cssmin, gulp, rev, uglify, usemin;

gulp = require('gulp');
usemin = require('gulp-usemin');
uglify = require('gulp-uglify');
cssmin = require('gulp-clean-css');
htmlmin = require('gulp-minify-html');
rev = require('gulp-rev');
jslint = require('gulp-jslint');

module.exports = (config) => {
  return ()=> {
    return gulp.src(config.tmpDir + "/*.html")
    .pipe(usemin({
      html:[(()=>{ return htmlmin()})],
      inlineJs:[(()=>{ return uglify()})],
    }))
    .pipe(gulp.dest(config.buildDir));
  };
};
