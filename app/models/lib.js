function Lib (args, db){
  this.collection = db.get('libs_collection');

  this.name = args.name;
  this.url = args.url;
};

Lib.FindAll = function(db, callback){
  this.collection = db.get('libs_collection');

  callback(collection.find)
};

Lib.prototype.save = function(callback){
  if (this.isNew()) {
    this.collection.insert({
      name: this.name,
      created_at: Date.now()
    });

    if (callback)
      callback(this);
  };

  return this;
};

Lib.prototype.isNew = function() {
  return !this.id;
};

exports.Lib = Lib;
