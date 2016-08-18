const 
           gulp = require('gulp'),
           glob = require("glob"),
             fs = require('fs'),
      camelCase = require('camel-case'),
      dashCase = require('camel-2-dash'),
           path = require('path'),
         marked = require('marked'),
            njk = require('nunjucks'),
       gulpData = require('gulp-data'),
   gulpNunjucks = require('gulp-nunjucks'),
       beautify = require('gulp-jsbeautifier'),
        plumber = require('gulp-plumber'),
   autoprefixer = require("gulp-autoprefixer"),
          gutil = require('gulp-util');

module.exports = (config, bsync) => () => {

    var contentJsonFiles = glob.sync(`${config.contDir}/*.json`),
         componentsFiles = glob.sync(`${config.srcDir}/render/components/*.html`),
          contentMdFiles = glob.sync(`${config.contDir}/*.md`),
                 cmsData = {"components":{},"contents":{}};


    var filters = require(`../${config.srcDir}/render/filters`);
    var njkEnv = njk.configure(`${config.srcDir}/render`,{autoescape:false});

    for(filter in filters){
      njkEnv.addFilter(filter, filters[filter] )
    }
    
    

    function getName(file){
      var ext = path.extname(file);
      var key = path.basename(file, ext);
      return {cml:camelCase(key),file:key+ext}
    }

    contentJsonFiles.forEach((file) => {
      var rawContent = fs.readFileSync(file,'utf-8');
      content = JSON.parse(rawContent);
      cmsData[getName(file).cml]=content;
    });
    
    componentsFiles.forEach((file) => {
      var key = getName(file)
      cmsData.components[key.cml] = `components/${key.file}`;
    })

    contentMdFiles.forEach((file) => {
        var rawContent = fs.readFileSync(file,'utf-8');
        markdownHtml =  marked(rawContent);

        // allow components in markdown contents
        markdownHtml = markdownHtml.replace(/\<p\>\[\%(.*)\%\]<\/p\>/g, '{% include $1 %}');
        cmsData.contents[getName(file).cml] = njkEnv.renderString(markdownHtml, cmsData)
    });
    

    return gulp.src(`${config.srcDir}/render/*.html`)
      .pipe(plumber())
      .pipe(gulpNunjucks.compile(cmsData,{env:njkEnv}))
      .pipe(beautify({indentSize: 2}))
      .pipe(gulp.dest(`./${config.tmpDir}`))
      .pipe(bsync.stream());

};