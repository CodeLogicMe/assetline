function Assets (db){
  this.collection = db.get('assets_collection');
};

Assets.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Assets.prototype.insert = function(args, callback){
  args.created_at = Date.now();
  this.collection.insert(args).success(callback)
};

exports.Assets = Assets;
