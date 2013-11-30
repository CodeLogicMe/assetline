var file = require("../collections/packages")
  , Packages = file.Packages;

var file = require("../../app/contexts/package_creation")
  , PackageCreation = file.PackageCreation;

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

    new PackageCreation(req.body).run(function(package){
      res.send(201, package);
    }, function(err){
      console.log(err);
      if (err.code === 'ECONFLICT') {
        res.send(500, 'Bower: couldn`t resolve dependencies');
      } else {
        res.send(500, err);
      };
    });
  };
};
