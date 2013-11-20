var exec = require('child_process').exec;
var async = require('async');
var bower = require('bower');
var _ = require('lodash');
var fs = require('fs');

function FetchLibs(libs){
  this.libs = libs;
};

FetchLibs.prototype.run = function(onEnd){
  var libs = this.$bowerNames(this.libs);
  this.$install(libs, onEnd);
};

FetchLibs.prototype.$bowerNames = function(libs){
  var name;
  return _.map(libs, function(lib){
    name = lib.name.toLowerCase();
    if (lib.versions) {
      return name + '#' + lib.versions[lib.versions.length-1];
    }

    return name;
  });
};

FetchLibs.prototype.$install = function(libs, onEnd){
  var that = this;
  bower.commands.install(libs, {}, {})
  .on('error', this.$logToFile)
  .on('end', function(){
    that.$findFileNames(onEnd)
  });
};

FetchLibs.prototype.$findFileNames = function(onEnd){
  var that = this
    , result = [];
  async.eachLimit(this.libs, 1, function(lib, asyncFinish){
    exec(that.$lsRecursiveCmd(lib),
      function(error, stdout, stderr){
        if (error !== null) {
          console.log('exec error: ' + error);
          return;
        };
        result.push(that.$getFiles(lib, stdout));
        asyncFinish();
      }
    );
  }, function(err){
    onEnd(result);
  });
};

FetchLibs.prototype.$getFiles = function(lib, listOfFiles){
  if (this.$mainFileExist(lib.name)) {
    return {
      name: lib.name,
      files: [lib.name]
    };
  } else {
    return {
      name: lib.name,
      files: this.$parseDistributionFilesPaths(lib.name, listOfFiles)
    };
  }
};

FetchLibs.prototype.$mainFileExist = function(libName){
  var filePath = __dirname.replace('app/actions', 'bower_components/');
  filePath += libName + '/' + libName + '.js';
  return fs.existsSync(filePath);
};

FetchLibs.prototype.$parseDistributionFilesPaths = function(libName, listOfFiles){
  var files = listOfFiles.split('\n');
  var matches, filesFound = [];
  _.each(files, function(file){
    matches = file.match(/\/(dist|modules).+?.js$/);
    if (matches)
      filesFound.push(matches[0]);
  });
  return filesFound;
};

FetchLibs.prototype.$lsRecursiveCmd = function(lib) {
  return "ls -R ./bower_components/"
        + lib.name
        + " | awk '"
        + "/:$/&&f{s=$0;f=0}"
        + "/:$/&&!f{sub(/:$/,\"\");s=$0;f=1;next}"
        + "NF&&f{ print s\"/\"$0 }'"
};

FetchLibs.prototype.$logToFile = function(msg){
  fs.appendFile('/tmp/bower_dev.log', msg + '\n');
};

exports.FetchLibs = FetchLibs;
