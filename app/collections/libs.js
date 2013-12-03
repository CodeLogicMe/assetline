function Libs(db){
  this.collection = db.get('libs_collection');
};

Libs.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Libs.prototype.where = function(args, callback){
  this.collection.find(args, function(err, items){
    callback(items);
  });
};

Libs.prototype.findAllActives = function(callback){
  this.where({active:true}, callback);
};

Libs.prototype.findAllInactives = function(callback){
  this.where({active:false}, callback);
};

Libs.prototype.findByName = function(name, callback){
  this.collection.find({name: name}, function(err, items){
    callback(items);
  });
};

Libs.prototype.insert = function(args, callback){
  args.created_at = Date.now();
  this.collection.insert(args).success(callback);
};

Libs.prototype.remove = function(id){
  return this.collection.remove({_id: id});
};

Libs.prototype.findAndUpdate = function(id, args, callback){
  args.updated_at = Date.now();
  this.collection.updateById(id, args, callback);
};

exports.Libs = Libs;
