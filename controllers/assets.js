
/*
 * GET asset listing.
 */

exports.list = function(db) {
  return function(req, res) {
    req.accepts('application/json');

    var collection = db.get('assetcollection');
    collection.find({},{},function(e,assets){
      res.send({
        "assets" : assets
      });
    });
  };
};

exports.create = function(db) {
  return function(req, res) {
    var collection = db.get('assetcollection');
    collection.insert({
      "names" : userName,
      "email" : userEmail
    }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
      } else {
        // If it worked, forward to success page
        res.redirect("userlist");
        // And set the header so the address bar doesn't still say /adduser
        res.location("userlist");
      };
    });
  };
};
