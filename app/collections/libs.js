function Libs(db){
  this.collection = db.get('libs_collection');
};

Libs.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Libs.prototype.insert = function(args, callback){
  args.created_at = Date.now();
  this.collection.insert(args).success(callback);
};

Libs.prototype.remove = function(id, callback){
  return this.collection.remove({_id: id});
};

exports.Libs = Libs;
