var file = require("../collections/asset")
  , Assets = file.Assets;

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Assets(db).findAll(function(assets){
      res.send({assets: assets});
    });
  };
};

exports.create = function(db){
  return function(req, res){
    req.accepts('application/json');

    new Assets({
      packages: req.packages
    }, db).save(function(asset){
      res.send(201, asset);
    });
  };
};
