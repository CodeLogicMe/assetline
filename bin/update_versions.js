var exec = require('child_process').exec;
var async = require('async');
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

function parseVersions(lib, onFinish){
  exec("git ls-remote --tags " + lib.website, function(error, stdout, stderr){
    if (stdout) {
      refs = stdout.toString()
      .trim()                         // Trim trailing and leading spaces
      .replace(/[\t ]+/g, ' ')        // Standardize spaces (some git versions make tabs, other spaces)
      .split(/[\r\n]+/);

      tags = _.map(refs, function(ref){
        version = ref.match(/(refs\/tags\/v?)(.+)$/m)[2];
        if (version.indexOf('^{}') === -1)
          return semver.valid(version);
      });
      saveVersions(lib, tags.filter(function(n){return n}), onFinish);
    } else {
      onFinish()
    }
  });
};

function saveVersions(lib, versions, onFinish) {
  lib.versions = versions;
  libsCollection.findAndUpdate(lib._id, lib);
  console.log('id -> ', lib._id);
  onFinish();
}

libsCollection.findAll(function(libs){
  async.eachLimit(libs, 50, function(lib, onFinish){
    parseVersions(lib, onFinish);
  });
});
