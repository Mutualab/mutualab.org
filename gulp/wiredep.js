const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
          bsync = require('browser-sync');

module.exports = (config,bsync) => () => {
  return gulp.src(`./${config.srcDir}/render/views/head.ejs`)
    .pipe( wiredep() )
    .pipe( gulp.dest(`./${config.srcDir}/render/views`) )
    .pipe( bsync.stream() ) ;
};