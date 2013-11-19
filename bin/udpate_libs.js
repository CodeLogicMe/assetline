var mongo = require('mongodb')
  , monk = require('monk')
  , db = monk('localhost:27017/assetline');

var file = require("../app/collections/libs")
  , Libs = file.Libs;

var request = require('request');
var _ = require('lodash');

request('http://bower-component-list.herokuapp.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    saveLibs(JSON.parse(body));
  };
});

function saveLibs(libs){
  var libsCollection = new Libs(db);
  _.each(libs, function(lib){
    libsCollection.findByName(lib.name, function(foundLibs){
      if (foundLibs.length === 0) {
        console.log('inserting -> ', lib.name);
        libsCollection.insert(lib);
      };
    });
  });
};
