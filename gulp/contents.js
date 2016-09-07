const 
           gulp = require('gulp'),
           glob = require("glob"),
             fs = require('fs'),
      camelCase = require('camel-case'),
       dashCase = require('camel-2-dash'),
           path = require('path'),
         marked = require('marked'),
    frontMatter = require('front-matter'),
            njk = require('nunjucks'),
       gulpData = require('gulp-data'),
   gulpNunjucks = require('gulp-nunjucks'),
       beautify = require('gulp-jsbeautifier'),
        plumber = require('gulp-plumber'),
   autoprefixer = require("gulp-autoprefixer"),
          gutil = require('gulp-util'),
             he = require('he'),
         dotenv = require('dotenv');

dotenv.config();

module.exports = (config, bsync) => () => {

    /**
     * Initialise content sources
     */
    var contentJsonFiles = glob.sync(`${config.contDir}/*.json`),
         componentsFiles = glob.sync(`${config.srcDir}/render/components/*.html`),
          contentMdFiles = glob.sync(`${config.contDir}/*.md`),
     contentMdPagesFiles = glob.sync(`${config.contDir}/pages/*.md`),
                 cmsData = {"components":{},"contents":{}};


    /**
     * Include filters
     */

    var filters = require(`../${config.srcDir}/render/filters`);

    /**
     * configure nunjucks render
     */

    var njkEnv = njk.configure(`${config.srcDir}/render`,
        {
          autoescape:false,
          tags: {
              blockStart: '{%',
              blockEnd: '%}',
              variableStart: '{{=',
              variableEnd: '}}',
              commentStart: '{#',
              commentEnd: '#}'
            }
          });

    for(filter in filters){
      njkEnv.addFilter(filter, filters[filter] )
    }
    

    /**
     * Generate uniq uid
     */
    
    function uid (){
        var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
        do {                
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode=Math.floor((Math.random()*42)+48);
            if (ascicode<58 || ascicode>64){
                // exclude all chars between : (58) and @ (64)
                idstr+=String.fromCharCode(ascicode);    
            }                
        } while (idstr.length<32);

        return (idstr);
       
    }

    /**
     * Format clean file name
     */
    function getName(file){
      var ext = path.extname(file);
      var key = path.basename(file, ext);
      return {cml:camelCase(key),file:key+ext, filename:key}
    }


    /**
     * Quick and dirty components system
     */
    
    function componentsSystem(raw) {
      results = {}
      matched = raw.match(/\[\%(.*)\%\]/g, results);
      if(matched){
        parsed = matched.map(function(elt){
          
          cleaned = elt.replace(/\[\%/g,'').replace(/\%\]/g,'')
          var splited = cleaned.split('(')
          var component = splited[0] ; 
          if(splited.length > 1){
            compName = 'comp'+uid()
            func = he.decode(cleaned.replace('components', compName));
            replaceStr = `{% import ${component} as ${compName} %}{{= ${func} }}`;
          }else{
            replaceStr = `{% include ${component} %}`;
          }
          return { 
            initial:elt , 
            replace:replaceStr 
          };
        })

        parsed.forEach(function(elt){
          reg = new RegExp(elt.initial.replace(/[-\/\\^$*+?.()|[\]{}\%]/g, '\\$&'),'g');
          raw = raw.replace(reg ,elt.replace);
        })
      }
      return raw
    }

    /**
     * Register json datas
     */

    contentJsonFiles.forEach((file) => {
      var rawContent = fs.readFileSync(file,'utf-8');
      content = JSON.parse(rawContent);
      cmsData[getName(file).cml]=content;
    });

    cmsData._config = {
      env: config.env
    };

     /**
     * Register components
     */

    componentsFiles.forEach((file) => {
      var key = getName(file);
      var rawContent = fs.readFileSync(file,'utf-8');
      cmsData.components[key.cml] = `components/${key.file}`;
    })

    /**
     * Register and parse markdown contents
     */

    contentMdFiles.forEach((file) => {
        var rawContent = fs.readFileSync(file,'utf-8');
        var parsed = componentsSystem(rawContent);
        markdownHtml =  marked(parsed);

        // allow components in markdown contents
        cmsData.contents[getName(file).cml] = njkEnv.renderString(markdownHtml, cmsData)
    });

    /**
     * Dynamic pages system
     */

    var defaultPageTemplate = fs.readFileSync(`${config.srcDir}/render/templates/page.html`,'utf-8');
    contentMdPagesFiles.forEach((file) => {
        var rawContent = fs.readFileSync(file,'utf-8');

        if(!fs.existsSync(config.tmpDir)) fs.mkdirSync(config.tmpDir);

        // extract front matter variable from content
        metadata = frontMatter(rawContent);
        rawContent = rawContent.replace( /^---([\s\S]*?)---$/m , '')

        // allow components in markdown contents
        markdownHtml =  marked(rawContent);

        // Select existing page specific template
        var pageTemplate = null;
        var fileSlug = getName(file).filename
        var targetFilename = `${fileSlug}.html`;
        var templateFile = `${config.srcDir}/render/templates/${targetFilename}`;
        if (!!fs.existsSync(templateFile)) { 
          pageTemplate = fs.readFileSync(templateFile,'utf-8'); 
        } else {
          pageTemplate = defaultPageTemplate
        }


        var parsed = njkEnv.renderString(componentsSystem(markdownHtml),cmsData);
        cmsData.currentPage = {
            content:parsed,
            metadata:metadata.attributes,
        }
        content = njkEnv.renderString(pageTemplate, cmsData);
        fs.writeFileSync(`./${config.tmpDir}/${targetFilename}` , content);

    });
    
    

    /**
     * Parse commun nunjucks template
     */
    
    return gulp.src(`${config.srcDir}/render/*.html`)
      .pipe(plumber())
      .pipe(gulpNunjucks.compile(cmsData,{env:njkEnv}))
      .pipe(beautify({indentSize: 2}))
      .pipe(gulp.dest(`./${config.tmpDir}`))
      .pipe(bsync.stream());

};