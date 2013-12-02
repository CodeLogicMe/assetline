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
      if (lib.website !== undefined) {
        var url = buildBowerDotJsonUrl(lib.website);
        checkBowerFile(url, lib, db);
      }
    });
  });
};

function checkBowerFile (url, lib) {
  request({uri:url,json:true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (body.main === undefined) {
        console.log('deleting -> ', lib.name);
        libsCollection.remove(lib.id);
      }
      else {
        console.log(body.main);
      }
    };
  });
};

function buildBowerDotJsonUrl (url) {
  var final_url = "";

  var prefix = "https://raw.github.com/";
  var postfix = "/master/bower.json";

  final_url = url.replace("https://github.com/", prefix);
  final_url = final_url + postfix;

  return final_url;
};

refreshLibs();
