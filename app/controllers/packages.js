var file = require("../collections/packages")
  , Packages = file.Packages;

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

    new Packages({
      package: req.package
    }, db).save(function(asset){
      res.send(201, package);
    });
  };
};
