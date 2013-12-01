var exec = require('child_process').exec;
var async = require('async');
var bower = require('bower');
var _ = require('lodash');
var fs = require('fs');

var bowerPath = __dirname.replace('app/actions', 'bower_components/');

function FetchLibs(libs){
  this.libs = libs;
};

FetchLibs.prototype.run = function(onEnd, onShit){
  var libs = this.$bowerNames(this.libs);
  this.$install(libs, onEnd, onShit);
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

FetchLibs.prototype.$install = function(libs, onEnd, onShit){
  var that = this;
  bower.commands.install(libs, {}, {})
  .on('error', function(err){
    that.$logToFile(err);
    onShit(err);
  }).on('end', function(){
    that.$findFileNames(onEnd);
  });
};

FetchLibs.prototype.$findFileNames = function(onEnd){
  var that = this
    , result = []
    , appendFiles = function(files, asyncFinish){
      if (typeof files === 'string'){
        result.push(files);
      } else {
        _.each(files, function(file){
          result.push(file);
        });
      };

      asyncFinish();
    };

  async.eachLimit(this.libs, 1, function(lib, asyncFinish){
    that.$findByMain(
      lib,
      appendFiles,
      function(lib, whenDone, asyncFinish){
        that.$findByName(lib, appendFiles, asyncFinish);
      },
      asyncFinish
    );
  }, function(err){
    onEnd(result);
  });
};

FetchLibs.prototype.$findByMain = function(lib, whenDone, whenNotFound, asyncFinish){
  var libPath = bowerPath + lib.name + '/';
  var file = fs.readFileSync(libPath + '/.bower.json');
  var bowerConfig = JSON.parse(file);
  var files;
  // console.log('main -> ', bowerConfig);

  if (bowerConfig.main){
    files = this.$addFullPathToFiles(libPath, bowerConfig.main);
    whenDone(files, asyncFinish);
  } else {
    whenNotFound(lib, whenDone, asyncFinish);
  };
};

FetchLibs.prototype.$addFullPathToFiles = function(libPath, files){
  if (typeof files === 'string'){
    return libPath + files.replace(/\.\//, '');
  } else {
    return _.map(files, function(file){
      return libPath + file.replace(/\.\//, '');
    });
  };
};

FetchLibs.prototype.$findByName = function(lib, whenDone, asyncFinish){
  var that = this;
  exec(this.$lsRecursiveCmd(lib),
    function(error, stdout, stderr){
      if (error !== null) {
        console.log('exec error: ' + error);
        return;
      };

      whenDone(that.$getFiles(lib, stdout), asyncFinish);
    }
  );
};

FetchLibs.prototype.$getFiles = function(lib, listOfFiles){
  var namedFile = this.$getNamedFile(lib.name);

  if (namedFile) {
    return [namedFile];
  } else {
    return this.$parseDistributionFilesPaths(lib.name, listOfFiles);
  };
};

FetchLibs.prototype.$getNamedFile = function(libName){
  var qualifiedName = libName.replace(/^./, '');
  var filePath = bowerPath + libName + '/' + qualifiedName + '.js';
  return (fs.existsSync(filePath) ? filePath : null);
};

FetchLibs.prototype.$parseDistributionFilesPaths = function(libName, listOfFiles){
  var files = listOfFiles.split('\n');
  var matches, filesFound = [];
  _.each(files, function(file){
    matches = file.match(/.+?\/(dist|modules).+?.js$/);
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
