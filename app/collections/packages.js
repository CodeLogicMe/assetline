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
  this.collection.insert(args).success(callback)
};

exports.Packages = Packages;
