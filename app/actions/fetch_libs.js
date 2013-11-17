var bower = require('bower');
var _ = require('lodash');
var fs = require('fs');

function FetchLibs(libs){
  this.libs = libs;
};

FetchLibs.prototype.run = function(whenDone){
  var libs = this.$bowerNames(this.libs);
  this.$install(libs, whenDone);
};

FetchLibs.prototype.$bowerNames = function(libs){
  var loweredCase;
  return _.map(libs, function(lib){
    loweredCase = lib.name.toLowerCase();
    return loweredCase + '#' + lib.version;
  });
};

FetchLibs.prototype.$install = function(libs, onEnd){
  bower.commands.install(libs, {}, {})
  .on('error', this.$logToFile)
  .on('end', onEnd);
};

FetchLibs.prototype.$logToFile = function(msg){
  fs.appendFile('/tmp/bower_dev.log', msg);
}

exports.FetchLibs = FetchLibs;
