const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
           bsync = require('browser-sync'),
          dotenv = require('dotenv'),
            argv = require('yargs').argv, 

             lib = require('./gulp');


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
gulp.task( 'assets'     , ['contents'], lib.assets(config , bsync) );


/**
 * Dev tasks
 */

gulp.task('bsync', () => {
  bsync.init({ server: { baseDir: [ './', config.tmpDir, config.buildDir]},
                 open: false });
});


/**
 * 
 */
gulp.task('default', ['contents','sass','wiredep','ngTemplates','js','assets'])

gulp.task('watch', () => {
  gulp.start(['default','bsync']);
  gulp.watch([`./${config.srcDir}/sass/**/*.scss`], ['sass']);
  gulp.watch([`./${config.srcDir}/ng/**/*.js`], ['js']);
  gulp.watch([`./${config.srcDir}/ng/**/*.html`], ['ngTemplates']);
  gulp.watch([`./${config.srcDir}/**/*.ejs`,`./${config.contDir}/**/*{.json,.md}`], ['contents']);
  gulp.watch([`./${config.tmpDir}/**/*.html`,
              `./${config.tmpDir}/**/*.js`,
              `./${config.buildDir}/**/*.svg`], () => {
    bsync.reload()
  });
  gulp.watch([`./${config.srcDir}/**/*.{eot,svg,ttf,woff,woff2}`],['assets'])
  gulp.watch([`bower.json`],['wiredep']);
});




