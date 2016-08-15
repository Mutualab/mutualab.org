
const      
           fs = require("fs"),
    camelCase = require('camel-case'),
         path = require('path')

var normalizedPath = path.join(__dirname);
var modules = {}
fs.readdirSync(normalizedPath).forEach(function(file) {
    var key = camelCase(file.replace('.js',''));
    modules[key]=require('./'+file);
});


module.exports = modules