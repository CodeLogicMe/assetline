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
    });
  };
};
