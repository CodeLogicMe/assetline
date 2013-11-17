var file = require("../collections/packages")
  , Packages = file.Packages;

var file = require("../../app/actions/fetch_libs")
  , FetchLibs = file.FetchLibs;

function extractParams(args){
  return {
    libs: args.libs
  };
};

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Packages(db).findAll(function(packages){
      res.send({packages: packages});
    });
  };
};

exports.create = function(db){
  return function(req, res){
    req.accepts('application/json');

    var args = extractParams(req.body);

    new Packages(db).insert(args, function(package){
      new FetchLibs(package.libs).run();
      res.send(201, package);
    });
  };
};
