const
       gulp = require('gulp'),
    replace = require('gulp-replace');

module.exports = (config,bsync) => ()=>{
    return gulp.src(
      [ 
        `./bower_components/font-awesome/fonts/*.{css,eot,svg,ttf,woff,woff2,otf}`,
        `./${config.srcDir}/fonts/**/*.{css,eot,svg,ttf,woff,woff2}`,
        `./${config.srcDir}/fonts/multicolore/*.pdf`,
        `!./${config.srcDir}/fonts/multicolore/specimen_files/*`])
      .pipe( gulp.dest(`./${config.tmpDir}/fonts`)) 
      .pipe( bsync.stream() );
}