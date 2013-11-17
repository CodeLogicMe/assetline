var _ = require('lodash');
var fs = require('fs')
var UglifyJS = require("uglify-js");

function CompileLibs(libs) {
  this.libs = libs;
  this.filesTypes = ['js'];
};

CompileLibs.prototype.run = function(){
  var that = this;
  var dir = this.$tmpDir();
  var files = _.map(this.libs, function(lib){
    return that.$filepath(dir, lib);
  });

  var result = UglifyJS.minify(files);
  var savedFiles = this.$saveFiles([result]);

  return savedFiles;
};

CompileLibs.prototype.$saveFiles = function(files){
  var filename = this.$publicDir()
                + this.$randomID()
                + '.min.js';

  return _.map(files, function(file){
    fs.writeFileSync(filename, file.code);
    return filename;
  });
};

CompileLibs.prototype.$randomID = function(files){
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < 32; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

CompileLibs.prototype.$tmpDir = function(){
  var appFolder = __dirname.replace(/app\/actions$/gm, '')
  return appFolder + 'bower_components/'
};

CompileLibs.prototype.$publicDir = function(){
  var appFolder = __dirname.replace(/app\/actions$/gm, '')
  return appFolder + 'public/packages/'
};

CompileLibs.prototype.$filepath = function(dir, lib){
  var name = lib.name.toLowerCase();
  return dir
    + name
    + '/'
    + name
    + '.'
    + lib.type.toLowerCase();
};

exports.CompileLibs = CompileLibs;
