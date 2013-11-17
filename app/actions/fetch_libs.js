var bower = require('bower');
var _ = require('lodash');

function FetchLibs(libs){
  this.libs = libs;
};

FetchLibs.prototype.run = function(whenDone){
  var libs = this.$bowerNames(this.libs);
  this.$install(libs, function (installed) {
    console.log(installed);
  });
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
  .on('log', function(status){
    // should log this locally
  })
  .on('error', function(err){
    // should log this locally
  })
  .on('end', onEnd);
};

exports.FetchLibs = FetchLibs;
