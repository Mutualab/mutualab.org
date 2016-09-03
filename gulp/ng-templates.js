const 
            gulp = require('gulp'),
       ngHtml2Js = require('gulp-ng-html2js'),
      minifyHtml = require('gulp-minify-html'),
          concat = require('gulp-concat'),
          uglify = require('gulp-uglify');

module.exports = (config, bsync) => () => {
    return gulp.src(`${config.srcDir}/ng/**/*.html`, 
                    {base: `${config.srcDir}/ng/templates`})
      .pipe(minifyHtml({empty: true,spare: true, quotes: true}))
      .pipe(ngHtml2Js({
          moduleName: 'templates'
      }))
      .pipe(concat("templates.js"))
      .pipe(uglify())
      .pipe(gulp.dest(`${config.tmpDir}/js/`))
      .pipe( bsync.stream() );
};