const   gulp = require('gulp'),
        sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
     plumber = require('gulp-plumber'),
autoprefixer = require("gulp-autoprefixer");


module.exports = (config, bsync) => () => {
  const mapsDir = `../maps`
  return gulp.src([`./${config.srcDir}/sass/**/*.scss`]) 
      .pipe( plumber()).pipe( sourcemaps.init() )
      .pipe( sass().on('error', sass.logError) )
      .pipe( sourcemaps.write({ includeContent: false, sourceRoot: `../${config.srcDir}/sass`}) )
      .pipe( sourcemaps.init({loadMaps: true}) )
      .pipe( autoprefixer({browsers: ["last 2 versions"],cascade: false}) )
      .pipe( sourcemaps.write(mapsDir, {includeContent: false, sourceRoot: `./${config.srcDir}/sass`}) )
      .pipe( gulp.dest(`./${config.tmpDir}/css`) )
      .pipe( bsync.stream() )
      
};