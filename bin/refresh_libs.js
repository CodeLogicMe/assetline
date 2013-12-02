var request = require('request');
var _ = require('lodash');
var db = {uri: 'http://assetline.io/libs', json: true};

request(db, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var libs = body.libs;

    _(libs).forEach(function (lib) {

      if (lib.website !== undefined) {
        var url = buildBowerDotJsonUrl(lib.website);
        checkBowerFile(url);
      }
    });
  };
});

function checkBowerFile (url) {
  request({uri: url, json: true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      if (body.main === undefined) {
        console.log('delete - ' + body.name)
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
