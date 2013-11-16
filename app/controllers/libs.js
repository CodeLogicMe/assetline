var file = require("../collections/libs")
  , Libs = file.Libs;

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Libs(db).findAll(function(libs){
      res.send({libs: libs});
    });
  };
};

exports.create = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Libs(db).insert({
      name: req.body.name,
      version: req.body.version,
      url: req.body.url
    }, function(lib){
      res.send({lib: lib});
    });
  };
};

exports.delete = function(db){
  return function(req, res){
    new Libs(db).remove(req.params.id).success(function(){
      res.send(200);
    });
  };
};
