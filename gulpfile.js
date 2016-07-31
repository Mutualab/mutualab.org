const       gulp = require('gulp'),
         wiredep = require('gulp-wiredep'),
      livereload = require('gulp-livereload'),
       webserver = require('gulp-webserver'),
            sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
         plumber = require('gulp-plumber')
      sourcemaps = require("gulp-sourcemaps"),
              fs = require('fs'),
            glob = require("glob"),
            path = require('path'),
          marked = require('marked'),
              md = require( "markdown-it" )().use(require('markdown-it-synapse-table'))
             ejs = require('ejs'),
      changeCase = require('change-case');
  
const srcDir   = "src",
      buildDir = "dist",
      contDir  = "contents";
 

/**
 * Dev tasks
 */
gulp.task('webserver', () => {
  gulp.src(['./',`./${srcDir}/`])
    .pipe(webserver({
      livereload: true,
      fallback: `./${srcDir}/index.html`
    }));
});


gulp.task('wiredep', () => {
  gulp.src(`./${srcDir}/index.ejs`)
    .pipe(wiredep())
    .pipe(gulp.dest('./${srcDir}'))
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
      .pipe(gulp.dest(`./${srcDir}/css`));
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
  fs.writeFileSync(`${srcDir}/index.html`,fileContent);
});

/**
 * Build tasks
 */
gulp.task('build',['contents'], ()=>{
    return gulp.src(
      [ `./${srcDir}/**/*.{html,js,css,eot,svg,ttf,woff,woff2}`,
        `./${srcDir}/**/multicolore/*.pdf`,
        `!./${srcDir}/**/specimen_files/*`])
      .pipe(gulp.dest(`./${buildDir}/`));
});


gulp.task('watch', () => {
  livereload.listen();

  gulp.watch([`./${srcDir}/*/**.scss`], ['sass']);
  gulp.watch([`./${srcDir}/**/*.ejs`,`./${contDir}/**/*{.json,.md}`], ['contents']);
  gulp.watch([`./${srcDir}/**/*.html`,
              `./${srcDir}/**/*.js`,
              `./${srcDir}/**/*.svg`], () => {
    livereload.reload()
  });




  gulp.watch([`./${srcDir}/css/**.css`], (evt) => {
    livereload.changed(evt.path)
  });

  gulp.watch([`bower.json`],['wiredep']);
  gulp.start('webserver')
})
