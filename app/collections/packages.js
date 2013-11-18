function Packages(db){
  this.collection = db.get('packages_collection');
};

Packages.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Packages.prototype.insert = function(args, callback){
  args.created_at = Date.now();
  this.collection.insert(args).success(callback);
};

Packages.prototype.findAndUpdate = function(id, args, callback){
  args.updated_at = Date.now();
  this.collection.updateById(id, args);
  callback(args);
};

exports.Packages = Packages;
