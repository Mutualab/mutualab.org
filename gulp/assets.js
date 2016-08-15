const
       gulp = require('gulp'),
    replace = require('gulp-replace');

module.exports = (config) => ()=>{
    return gulp.src(
      [ `./${config.srcDir}/**/*.{css,eot,svg,ttf,woff,woff2}`,
        `./${config.srcDir}/**/multicolore/*.pdf`,
        `!./${config.srcDir}/**/specimen_files/*`])
      .pipe( gulp.dest(`./${config.buildDir}/`)) ;
}