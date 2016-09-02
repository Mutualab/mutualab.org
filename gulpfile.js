const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
           bsync = require('browser-sync').create(),
          dotenv = require('dotenv'),
            argv = require('yargs').argv, 
           watch = require('gulp-watch');

const  lib = require('./gulp')

dotenv.config();
const config = {
      srcDir   : "src",
      buildDir : "dist",
      tmpDir   : ".tmp",
      contDir  : "contents"
};
 
/**
 * Init tasks stored in ./gulp folder
 */

gulp.task( "sass"       , lib.sass(config, bsync) );
gulp.task( 'contents'   , lib.contents(config, bsync) );
gulp.task( 'ngTemplates', lib.ngTemplates(config, bsync) );
gulp.task( "js"         , lib.javascript(config, bsync) );
gulp.task( 'wiredep'    , lib.wiredep(config , bsync) );
gulp.task( 'images'     , lib.images(config , bsync) );
gulp.task( 'fonts'      , ['contents'], lib.fonts(config , bsync) );


/**
 * Dev tasks
 */

gulp.task('bsync', () => {
  bsync.init({ 
                server: { baseDir: [ './', config.tmpDir, config.buildDir]},
       injectFileTypes: ["css","map", "png", "jpg", "jpeg", "gif", "webp"],
                online: false,
                  open: false,
             });
});


gulp.task('reload',()=>{
    return gulp.src([`./${config.tmpDir}/**/*.html`,`./${config.tmpDir}/**/*.js`,`./${config.buildDir}/**/*.svg`])
        .pipe(bsync.stream());
})

/**
 *  Default task
 */

gulp.task('default', ['contents','sass','wiredep','ngTemplates','js','images','fonts'])

gulp.task('watch',['default'], () => {
  
  gulp.start('bsync');
  gulp.watch([`bower.json`],['wiredep']);
  watch([`./${config.srcDir}/sass/**/*.scss`], function(){ gulp.start(['sass']);});
  watch([`./${config.srcDir}/ng/**/*.js`], function(){ gulp.start(['js']);});
  watch([`./${config.srcDir}/ng/**/*.html`], function(){ gulp.start(['ngTemplates']);});
  watch([`./${config.srcDir}/render/**/*.{html,js}`,
         `./${config.contDir}/**/*.{json,md}`], function(){ gulp.start(['contents']);});

  watch([`./${config.srcDir}/fonts/**/*.{eot,svg,ttf,woff,woff2}`],function(){ gulp.start(['fonts'])});
  watch([ `./${config.srcDir}/images/**/*.{svg, jpg, png, gif}`],function(){ gulp.start(['images'])});
  
});




