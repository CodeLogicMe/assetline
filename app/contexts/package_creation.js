var file = require("../collections/packages")
  , Packages = file.Packages;

var file = require("../../app/actions/fetch_libs")
  , FetchLibs = file.FetchLibs;

var file = require("../../app/actions/compile_libs")
  , CompileLibs = file.CompileLibs;

function PackageCreation(args){
  this.args = this.$extractParams(args);
};

PackageCreation.prototype.run = function(whenOk){
  var that = this;
  new Packages(db).insert(this.args, function(package){
    return that.$minifyThisShit(package, whenOk);
  });
};

PackageCreation.prototype.$extractParams = function(args){
  return {
    libs: args.libs
  };
};

PackageCreation.prototype.$minifyThisShit = function(package, whenOk){
  var libs = new FetchLibs(package.libs).run(function(result){
    console.log('fetch -> ', result)
    console.log('libs -> ', package.libs);
    var shit = new CompileLibs(package.libs).run();
    console.log('shit -> ', shit);
    whenOk(package);
  });
}

exports.PackageCreation = PackageCreation;
