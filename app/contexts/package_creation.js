var file = require("../collections/packages")
  , Packages = file.Packages;

var file = require("../../app/actions/fetch_libs")
  , FetchLibs = file.FetchLibs;

var file = require("../../app/actions/compile_libs")
  , CompileLibs = file.CompileLibs;

function PackageCreation(args){
  this.args = this.$extractParams(args);
};

PackageCreation.prototype.run = function(whenOk, whenShitHappened){
  var that = this;
  new Packages(db).insert(this.args, function(package){
    return that.$minifyThisShit(package, whenOk, whenShitHappened);
  });
};

PackageCreation.prototype.$extractParams = function(args){
  return {
    libs: args.libs
  };
};

PackageCreation.prototype.$minifyThisShit = function(package, whenOk, whenShitHappened){
  var libs = new FetchLibs(package.libs).run(function(result){
    var shit = new CompileLibs(result).run();
    package.url = shit[0];
    new Packages(db).findAndUpdate(package._id, package, whenOk);
    whenOk()
  }, whenShitHappened);
};

exports.PackageCreation = PackageCreation;
