var _ = require('lodash');
var fs = require('fs')
var UglifyJS = require("uglify-js");

function CompileLibs(files) {
  this.files = files;
  this.filesTypes = ['js'];
  console.log(this.files);
};

CompileLibs.prototype.run = function(){
  var that = this;
  var bowerDir = this.$bowerDir();

  var result = UglifyJS.minify(this.files);
  var savedFiles = this.$saveFiles([result]);
  // console.log(savedFiles);

  return savedFiles;
};

CompileLibs.prototype.$saveFiles = function(files){
  var filename = this.$publicDir()
                + this.$randomID()
                + '.min.js';

  return _.map(files, function(file){
    fs.writeFileSync(filename, file.code);
    return filename.match(/packages.+/m)[0];
  });
};

CompileLibs.prototype.$randomID = function(files){
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

CompileLibs.prototype.$bowerDir = function(){
  return __dirname.replace(/app\/actions$/, 'bower_components/')
};

CompileLibs.prototype.$publicDir = function(){
  var appFolder = __dirname.replace(/app\/actions$/gm, '')
  return appFolder + 'public/packages/'
};

CompileLibs.prototype.$getFullPath = function(dir, libName, file){
  return dir
    + libName.toLowerCase()
    + file;
};

exports.CompileLibs = CompileLibs;
