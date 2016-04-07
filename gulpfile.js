// npm install --save  gulp-wiredep gulp
const  gulp = require('gulp'),
    wiredep = require('gulp-wiredep'),
 livereload = require('gulp-livereload'),
  webserver = require('gulp-webserver');
  
const srcDir   = "src",
      buildDir = "dist";
 
gulp.task('webserver', () => {
  gulp.src(['./',`./${srcDir}/`])
    .pipe(webserver({
      livereload: true,
      fallback: `./${srcDir}/index.html`
    }));
});


gulp.task('wiredep', () => {
  gulp.src(`./${srcDir}/index.html`)
    .pipe(wiredep())
    .pipe(gulp.dest('./${srcDir}'))
    .pipe(livereload());
});

const       sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
         plumber = require('gulp-plumber')
      sourcemaps = require("gulp-sourcemaps");

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

gulp.task('build', ()=>{
    return gulp.src(
      [`./${srcDir}/**/*.html`,
       `./${srcDir}/**/*.js`,
       `./${srcDir}/**/*.css`,
       ])
      .pipe(gulp.dest(`./${buildDir}/`));
});


gulp.task('watch', () => {
  livereload.listen();

  gulp.watch([`./${srcDir}/*/**.scss`], ['sass']);

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
