const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
          bsync = require('browser-sync');

module.exports = (config,bsync) => () => {
  return gulp.src(`./${config.srcDir}/render/index.ejs`)
    .pipe( wiredep() )
    .pipe( gulp.dest(`./${config.srcDir}/render`) )
    .pipe( bsync.stream() ) ;
};