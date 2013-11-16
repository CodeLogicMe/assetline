function Assets (db){
  this.collection = db.get('assets_collection');
};

Assets.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Assets.prototype.insert = function(args, callback){
  this.collection.insert({
    packages: args.packages,
    created_at: Date.now()
  }).success(function(asset){
    callback(asset);
  });
};

exports.Assets = Assets;
