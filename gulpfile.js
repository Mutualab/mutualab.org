


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
      changeCase = require('change-case'),
         dotenv  = require('dotenv'),
         replace = require('gulp-replace');


dotenv.config();
const srcDir   = "src",
      buildDir = "dist",
      tmpDir   = ".tmp",
      contDir  = "contents";
 




/**
 * Dev tasks
 */

gulp.task('bsync', () => {
  bsync.init({
    server: {
      baseDir: [ './', tmpDir, buildDir]
    },
    open: false
  });
});




gulp.task('wiredep', () => {
  gulp.src(`./${srcDir}/index.ejs`)
    .pipe(wiredep())
    .pipe(gulp.dest(`./${srcDir}`))
    .pipe(livereload());
});


gulp.task("sass", () => {
  const mapsDir = `../maps`
  return gulp.src([`./${srcDir}/sass/**/*.scss`]) 
      .pipe(plumber()).pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write({includeContent: false, sourceRoot: `../${srcDir}/sass`}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer({browsers: ["last 2 versions"],cascade: false}))
      .pipe(sourcemaps.write(mapsDir, {includeContent: false, sourceRoot: `./${srcDir}/sass`}))
      .pipe(gulp.dest(`./${tmpDir}/css`));
});


gulp.task("js", () => {
  gulp.src(`./${srcDir}/js/**/*.js`)
  .pipe(replace(/__FLICKR_API_KEY__/g, process.env.FLICKR_API_KEY ))
  .pipe(gulp.dest(`./${tmpDir}/js`))
  
});



gulp.task('contents',()=>{
  var files = glob.sync(`${contDir}/*{.json,.md}`);
  var data = {};


  files.forEach((file)=>{
    var ext = path.extname(file);
    var key = path.basename(file, ext);
    var rawContent = fs.readFileSync(file,'utf-8');
    var content = null;
    if(ext == '.json'){
      content = JSON.parse(rawContent);
    }else if(ext == '.md'){
      content = marked(rawContent);
      //content = md.render(rawContent)
    }
    data[key]=content;
  });


  var file = fs.readFileSync(`${srcDir}/index.ejs`,'utf-8');
  var fileContent = ejs.render(file, data, {});
  fs.exists( tmpDir, function(exists) {
    if (!exists)  fs.mkdirSync(tmpDir);

    fs.writeFileSync(`${tmpDir}/index.html`,fileContent);
  });

  
});

/**
 * 
 */
gulp.task('assets',['contents'], ()=>{
    return gulp.src(
      [ `./${srcDir}/**/*.{css,eot,svg,ttf,woff,woff2}`,
        `./${srcDir}/**/multicolore/*.pdf`,
        `!./${srcDir}/**/specimen_files/*`])
      .pipe(gulp.dest(`./${buildDir}/`));
});


/**
 * 
 */
gulp.task('default', ['contents','sass','js','assets'])

gulp.task('watch', () => {
  livereload.listen();

  gulp.watch([`./${srcDir}/*/**.scss`], ['sass']);
  gulp.watch([`./${srcDir}/*/**.js`], ['js']);

  gulp.watch([`./${srcDir}/**/*.ejs`,`./${contDir}/**/*{.json,.md}`], ['contents']);
  gulp.watch([`./${buildDir}/**/*.html`,
              `./${tmpDir}/**/*.js`,
              `./${buildDir}/**/*.svg`], () => {
    bsync.stream()
  });

  gulp.watch([`./${tmpDir}/css/**.css`], (evt) => {
    bsync.stream()
  });

  gulp.watch([`./${srcDir}/**/*.{eot,svg,ttf,woff,woff2}`],['assets'])

  gulp.watch([`bower.json`],['wiredep']);
  gulp.start(['default','bsync']);
})
