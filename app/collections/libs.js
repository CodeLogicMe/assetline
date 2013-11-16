function Libs (db){
  this.collection = db.get('libs_collection');
};

Libs.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Libs.prototype.insert = function(args, callback){
  this.collection.insert({
    name: args.name,
    version: args.version,
    url: args.url,
    created_at: Date.now()
  }).success(function(asset){
    callback(asset);
  });
};

Libs.prototype.remove = function(id, callback){
  return this.collection.remove({_id: id});
};

exports.Libs = Libs;
