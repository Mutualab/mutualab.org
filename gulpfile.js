const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
           bsync = require('browser-sync').create(),
          dotenv = require('dotenv'),
            argv = require('yargs').argv, 
           watch = require('gulp-watch'),
            del  = require('del'),
             git = require('gulp-git'),
        gulpsync = require('gulp-sync')(gulp).sync;

const  lib = require('./gulp')

dotenv.config();
const config = {
      srcDir   : "src",
      buildDir : "dist",
      tmpDir   : ".tmp",
      contDir  : "contents",
      ghPages   : ["css","fonts","images","js","*.html"],
      env : process.env.ENV
};
 
/**
 * Init tasks stored in ./gulp folder
 */

gulp.task( "sass"         , lib.sass(config, bsync) );
gulp.task( 'contents'     , lib.contents(config, bsync) );
gulp.task( 'ngTemplates'  , lib.ngTemplates(config, bsync) );
gulp.task( "js"           , lib.javascript(config, bsync) );
gulp.task( 'wiredep'      , lib.wiredep(config , bsync) );
gulp.task( 'images'       , lib.images(config , bsync) );
gulp.task( 'fonts'        , ['contents'], lib.fonts(config , bsync) );
gulp.task( 'minify'       , lib.minify(config) );
gulp.task( 'clean:tmp'    , lib.clean(config,"tmpDir") );
gulp.task( 'clean:build'  , lib.clean(config,"buildDir") );
gulp.task( 'clean:gh-page', lib.clean(config,"ghPages") );





/**
 * Prepare for dist
 */



gulp.task('prepare',()=>{
  return gulp.src([
          `${config.tmpDir}/**/*.{svg,jpg,png,gif}`,
          `${config.tmpDir}/**/*.{eot,svg,ttf,woff,woff2}`])
         .pipe(gulp.dest(config.buildDir))
});

gulp.task('git:co:gh-pages',(done)=>{
  git.checkout('gh-pages',{},(err)=>{
    if (err) throw err;
    done();
  })
})


gulp.task('git:commit:gh-pages',()=>{
  return gulp.src(["./css/**/*","./fonts/**/*","./images/**/*","./js/**/*","./*.html"])
         .pipe(git.add())
         .pipe(git.commit("Automatic publication",{
                disableAppendPaths: true
           })   
         );
})


gulp.task('git:push:gh-pages',(done)=>{
  git.push('origin', 'gh-pages',{},(err)=>{
    if (err) throw err;
    done();
  })
})


gulp.task('git:co:master',(done)=>{
  git.checkout('master',{},(err)=>{
    if (err) throw err;
    done();
  })
})


gulp.task('dist:copy',()=>{
  return gulp.src(["dist/**/*"]).pipe(gulp.dest("."));
})



/**
 * Dev tasks
 */

gulp.task('bsync', () => {
  bsync.init({ 
                server: { baseDir: [ './', config.tmpDir]},
       injectFileTypes: ["css","map", "png", "jpg", "jpeg", "gif", "webp"],
                online: true,
                  open: false,
             });
});


gulp.task('bsync:built', () => {
  bsync.init({ 
                server: { baseDir: [ config.buildDir]},
       injectFileTypes: ["css","map", "png", "jpg", "jpeg", "gif", "webp"],
                online: true,
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

const defaultStack = ['contents','sass','wiredep','ngTemplates','js','images','fonts']
gulp.task('default', defaultStack)

const buildStack = defaultStack.map((e)=>e).concat(['minify','prepare'])
buildStack.unshift('clean:tmp','clean:build')
gulp.task('build', gulpsync(buildStack) )


const buildServeStack = buildStack.map((e)=>e).concat(['bsync:built'])
gulp.task('build:serve', gulpsync(buildServeStack) )


const buildGhPages = buildStack.map((e)=>e).concat([
    'git:co:gh-pages','clean:gh-page','dist:copy','clean:build','git:commit:gh-pages','git:push:gh-pages','git:co:master'])

gulp.task('build:gh-pages',gulpsync(buildGhPages));

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




