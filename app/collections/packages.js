function Packages(db){
  this.collection = db.get('packages_collection');
};

Packages.prototype.findAll = function(callback){
  this.collection.find({}, function(err, items){
    callback(items);
  });
};

Packages.prototype.insert = function(args, callback){
  args.created_at = currentDate();
  // _id.getTimestamp()
  this.collection.insert(args).success(callback);
};

Packages.prototype.findAndUpdate = function(id, args, callback){
  args.updated_at = Date.now();
  this.collection.updateById(id, args);
  callback(args);
};

function currentDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}

  return yyyy + '/' + mm + '/' + dd;;
};

exports.Packages = Packages;
