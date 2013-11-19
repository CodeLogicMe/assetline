var execSync = require('execSync');
var semver = require('semver');

var mongo = require('mongodb')
  , monk = require('monk')
  , db = monk('localhost:27017/assetline');

var file = require("../app/collections/libs")
  , Libs = file.Libs
  , libsCollection = new Libs(db);

var exec = require('child_process').exec;
var _ = require('lodash');
var refs, tags, version;

function parseVersions(lib){
  var result = execSync.exec("git ls-remote --tags " + lib.website);

  try {
    if (result.code == 0) {
      refs = result.stdout.toString()
      .trim()                         // Trim trailing and leading spaces
      .replace(/[\t ]+/g, ' ')        // Standardize spaces (some git versions make tabs, other spaces)
      .split(/[\r\n]+/);

      tags = _.map(refs, function(ref){
        version = ref.match(/(refs\/tags\/v?)(.+)$/m)[2];
        if (version.indexOf('^{}') === -1)
          return semver.valid(version);
      });
      saveVersions(lib, tags.filter(function(n){return n}));
    }
  } catch (e) {
    console.log(lib.name, lib.website);
  }
}

function saveVersions(lib, versions) {
  lib.versions = versions;
  libsCollection.findAndUpdate(lib._id, lib);
  console.log('id -> ', lib._id);
}

libsCollection.findAll(function(libs){
  _.map(libs, function(lib){
    parseVersions(lib);
  });
});
