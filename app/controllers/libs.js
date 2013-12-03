var file = require("../collections/libs")
  , Libs = file.Libs;

function extractParams(args){
  return {
    name: args.name,
    version: args.version,
    type: args.type
  };
};

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Libs(db).findAllActives(function(libs){
      libs.sort(function(a, b){
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
      res.send({libs: libs});
    });
  };
};

exports.create = function(db){
  return function(req, res){
    req.accepts('application/json');

    var args = extractParams(req.body);

    new Libs(db).insert(args, function(lib){
      res.send(201, {lib: lib});
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

exports.update = function(db){
  return function(req, res){
    req.accepts('application/json');

    var args = extractParams(req.body);

    new Libs(db).findAndUpdate(req.params.id, args)
    res.send(200, args);
  };
};
