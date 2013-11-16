
/*
 * GET asset listing.
 */

var file = require("../models/asset")
  , Asset = file.Asset;

exports.list = function(db){
  return function(req, res){
    req.accepts('application/json');

    var collection = db.get('assetcollection');
    collection.find({},{},function(e,assets){
      res.send({
        "assets" : assets
      });
    });
  };
};

exports.create = function(db){
  return function(req, res){
    new Asset({
      packages: req.packages
    }, db).save(function(asset){
      res.send(201, asset);
    });
  };
};
