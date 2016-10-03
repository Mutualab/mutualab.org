const
       gulp = require('gulp'),
    replace = require('gulp-replace');

module.exports = (config,bsync) => ()=>{
    return gulp.src(
      [ `./${config.srcDir}/images/**/*.{svg,jpg,png,gif}`,
        `./${config.contDir}/images/**/*.{svg,jpg,png,gif}`])
      .pipe( gulp.dest(`./${config.tmpDir}/images`)) 
      .pipe( bsync.stream() );
}