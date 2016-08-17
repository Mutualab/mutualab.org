const
       gulp = require('gulp'),
    replace = require('gulp-replace');

module.exports = (config,bsync) => ()=>{
    return gulp.src(
      [ `./${config.srcDir}/fonts/**/*.{css,eot,svg,ttf,woff,woff2}`,
        `./${config.srcDir}/fonts/multicolore/*.pdf`,
        `!./${config.srcDir}/fonts/multicolore/specimen_files/*`])
      .pipe( gulp.dest(`./${config.buildDir}/`)) 
      .pipe( bsync.stream() );
}