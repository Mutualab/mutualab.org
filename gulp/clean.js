var del, gulp, stripDebug, vinylPaths;

gulp = require('gulp');
stripDebug = require('gulp-strip-debug');
del = require('del');
vinylPaths = require('vinyl-paths');

module.exports = function(config, target) {
  if (target == null) {
    target = 'tmp';
  }
  return function() {
    return gulp.src("" + config[target]).pipe(vinylPaths(del)).pipe(stripDebug());
  };
};


