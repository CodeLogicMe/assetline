var file = require("../models/lib")
  , Lib = file.Lib;

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    Lib.findAll(db, function(libs){
      res.send({libs: libs});
    });
  };
};

exports.create = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Lib({
      name: req.params,
      url: req.params
    }, db).save(function(lib){
      req.send({lib: lib});
    });
  }
}
