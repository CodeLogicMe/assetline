var file = require("../models/lib")
  , Lib = file.Lib;

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    Lib.findAll(db, function(libs){
      res.send({libs: libs});
    });
  }
});
