const
       gulp = require('gulp'),
    replace = require('gulp-replace');


module.exports = (config,bsync) => () => {
  gulp.src(`./${config.srcDir}/ng/**/*.js`)
  .pipe( replace(/__FLICKR_API_KEY__/g, process.env.FLICKR_API_KEY ) )
  .pipe( gulp.dest(`./${config.tmpDir}/js`) )
  .pipe( bsync.stream() )
};