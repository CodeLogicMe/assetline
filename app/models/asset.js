function Asset (args, db){
  this.collection = db.get('assetcollection');

  this.packages = args.packages;
  this.created_at = Date.now();
};

Asset.prototype.save = function(){
  if (this.isNew()) {
    this.collection.insert({
      packages: this.packages,
      created_at: this.created_at
    });
  };

  return this;
};

Asset.prototype.isNew = function() {
  return !this.id;
};

exports.Asset = Asset;
