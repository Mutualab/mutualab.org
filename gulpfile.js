


const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
      livereload = require('gulp-livereload'),
            sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
         plumber = require('gulp-plumber')
      sourcemaps = require("gulp-sourcemaps"),
           bsync = require('browser-sync'),
              fs = require('fs'),
            glob = require("glob"),
            path = require('path'),
          marked = require('marked'),
              md = require( "markdown-it" )().use(require('markdown-it-synapse-table'))
             ejs = require('ejs'),
         gulpEjs = require('gulp-ejs'),
      changeCase = require('change-case'),
          dotenv = require('dotenv'),
         replace = require('gulp-replace'),
            argv = require('yargs').argv, 
           spawn = require('child_process').spawn,
       camelCase = require('camel-case'),
        beautify = require('gulp-jsbeautifier'),
       ngHtml2Js = require('gulp-ng-html2js'),
      minifyHtml = require('gulp-minify-html'),
          concat = require('gulp-concat'),
          uglify = require('gulp-uglify');


dotenv.config();
const config = {
      srcDir   : "src",
      buildDir : "dist",
      tmpDir   : ".tmp",
      contDir  : "contents"
};
 

/**
 * Dev tasks
 */

gulp.task('bsync', () => {
  bsync.init({
    server: {
      baseDir: [ './', config.tmpDir, config.buildDir]
    },
    open: false
  });
});




gulp.task('wiredep', () => {
  gulp.src(`./${config.srcDir}/render/index.ejs`)
    .pipe( wiredep() )
    .pipe( gulp.dest(`./${config.srcDir}/render`) )
    .pipe( livereload()) ;
});


gulp.task("sass", () => {
  const mapsDir = `../maps`
  return gulp.src([`./${config.srcDir}/sass/**/*.scss`]) 
      .pipe( plumber()).pipe( sourcemaps.init() )
      .pipe( sass().on('error', sass.logError) )
      .pipe( sourcemaps.write({ includeContent: false, 
                                sourceRoot: `../${config.srcDir}/sass`}) )
      .pipe( sourcemaps.init({loadMaps: true}) )
      .pipe( autoprefixer({browsers: ["last 2 versions"],cascade: false}) )
      .pipe( sourcemaps.write(mapsDir, {includeContent: false, 
                                        sourceRoot: `./${config.srcDir}/sass`}) )
      .pipe( gulp.dest(`./${config.tmpDir}/css`) )
      .pipe( bsync.reload({stream:true}) );
});


gulp.task("js", () => {
  gulp.src(`./${config.srcDir}/ng/**/*.js`)
  .pipe( replace(/__FLICKR_API_KEY__/g, process.env.FLICKR_API_KEY ) )
  .pipe( gulp.dest(`./${config.tmpDir}/js`) )
  
});

gulp.task('contents',() => {
  var contentJsonFiles = glob.sync(`${config.contDir}/*.json`);
  var componentsFiles = glob.sync(`${config.srcDir}/render/components/*{.ejs,.html}`);

  var contentMdFiles = glob.sync(`${config.contDir}/*.md`);
  var viewsFiles = glob.sync(`${config.srcDir}/render/views/*{.ejs,.html}`);
  var data = {"views":{},"components":{}};

  function getName(file){
    var ext = path.extname(file);
    var key = path.basename(file, ext);
    return camelCase(key)
  }

  contentJsonFiles.forEach((file) => {
    var rawContent = fs.readFileSync(file,'utf-8');
    content = JSON.parse(rawContent);
    data[getName(file)]=content;
  });


  componentsFiles.forEach((file) => {
    data.components[getName(file)] = ejs.compile(fs.readFileSync(file,'utf-8'), {});
  })


  contentMdFiles.forEach((file) => {
      var rawContent = fs.readFileSync(file,'utf-8');

      tmpData = {
        data:data,
        components:data.components
      };

      markdownHtml =  marked(rawContent)
      // allow components in markdown contents
      markdownHtml = markdownHtml.replace(/\<p\>\[\%(.*)\%\]<\/p\>/g, "<%- (typeof $1 == 'function' ? $1(data) : $1) %>");
      data[getName(file)] = ejs.render(markdownHtml, tmpData, {} )
  });

  viewsFiles.forEach((file) => {
    data.views[getName(file)] = ejs.render(fs.readFileSync(file,'utf-8'), data);
  })



  return gulp.src(`${config.srcDir}/render/**/*.ejs`)
    .pipe(gulpEjs(data,{ext:'.html'}))
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest(`./${config.tmpDir}`))
});




/**
 * 
 */
gulp.task('assets',['contents'], ()=>{
    return gulp.src(
      [ `./${config.srcDir}/**/*.{css,eot,svg,ttf,woff,woff2}`,
        `./${config.srcDir}/**/multicolore/*.pdf`,
        `!./${config.srcDir}/**/specimen_files/*`])
      .pipe( gulp.dest(`./${config.buildDir}/`)) ;
});



/**
 * 
 */

gulp.task('ngTemplates', () => {

  return gulp.src(`${config.srcDir}/ng/**/*.html`, {base: `${config.srcDir}/ng/templates`})
  .pipe(minifyHtml({empty: true,spare: true, quotes: true}))
  .pipe(ngHtml2Js({
      moduleName: 'templates',
      /*rename: function(templateUrl) {
        return templateUrl.replace(replace, '');
      }*/
  }))
  .pipe(concat("templates.js"))
  .pipe(uglify())
  .pipe(gulp.dest(`${config.tmpDir}/js/`));

});

/**
 * 
 */
gulp.task('default', ['contents','sass','wiredep','ngTemplates','js','assets'])

gulp.task('watch', () => {
  livereload.listen();

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

  gulp.start(['default','bsync']);
})
