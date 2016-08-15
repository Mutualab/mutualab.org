const 
           gulp = require('gulp'),
           glob = require("glob"),
             fs = require('fs'),
      camelCase = require('camel-case'),
           path = require('path'),
         marked = require('marked'),
            ejs = require('ejs'),
        gulpEjs = require('gulp-ejs'),  
       beautify = require('gulp-jsbeautifier'),
        plumber = require('gulp-plumber'),
   autoprefixer = require("gulp-autoprefixer");

module.exports = (config, bsync) => () => {

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
      .pipe(gulp.dest(`./${config.tmpDir}`));
};