var request = require('request');
var _ = require('lodash');

var mongo = require('mongodb')
  , monk = require('monk')
  , db = monk('localhost:27017/assetline');

var file = require("../app/collections/libs")
  , Libs = file.Libs
  , libsCollection = new Libs(db);

function refreshLibs () {
  libsCollection.findAll(function(libs){
    _(libs).forEach(function (lib) {
      if (lib.website) {
        var url = buildBowerDotJsonUrl(lib.website);
        checkBowerFile(url, lib, db);
      };
    });
  });
};

function checkBowerFile (url, lib) {
  request({uri:url,json:true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {

        if (hasAValidMain(body)) {
          setAsActive(lib);
        } else {
          setAsInactive(lib);
        };
      } catch (exception) {
        console.log(exception);
        console.log(body);
        setAsInactive(lib);
      };
    };
  });
};

function setAsActive(lib){
  console.log('Activating -> ', lib._id, lib.name);
  lib.active = true;
  libsCollection.findAndUpdate(lib._id, lib);
};

function setAsInactive(lib){
  console.log('Deactivating -> ', lib._id, lib.name);
  lib.active = false;
  libsCollection.findAndUpdate(lib._id, lib);
};

function hasAValidMain(bowerFile){
  if (bowerFile.main) {
    if (typeof bowerFile.main === 'string' &&
        bowerFile.main.match(/\.js$/)){
      return true;
    }
    return _.any(bowerFile.main, function(file){
      return file.match(/\.js$/);
    });
  }

  return false;
}

function buildBowerDotJsonUrl (url) {
  var final_url = "";

  var postfix = "/master/bower.json";

  final_url = url.replace(/\/\/(www\.)?/gm, "//raw.")

  return final_url + postfix;;
};

refreshLibs();
