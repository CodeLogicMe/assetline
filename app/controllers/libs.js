var file = require("../collections/libs")
  , Libs = file.Libs;

function extractParams(args){
  return {
    name: args.name,
    version: args.version,
    url: args.url,
    type: args.type
  };
};

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

    args = extractParams(req.body);

    new Libs(db).insert(args, function(lib){
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
