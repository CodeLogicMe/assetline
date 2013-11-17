var file = require("../../app/actions/fetch_libs")
  , FetchLibs = file.FetchLibs;

describe('FetchLibs', function(){
  var db = {get: function(){}}
      , collection = {insert: function(){}};

  describe('#constructor', function(){
    it('should initiate the variables correctly', function(){
      var libs = [
        {name: 'AngularJS', version: '1.2.1'}
      ];

      var fetch_libs = new FetchLibs(libs);

      expect(fetch_libs.libs).toBe(libs);
    });
  });

  describe('#run', function(){
    it('should pass the right config to $install', function(){
      var libs = [
        {name: 'AngularJS', version: '1.2.1'}
      ];

      var fetch_libs = new FetchLibs(libs);
      spyOn(fetch_libs, '$install');
      fetch_libs.run();

      expect(fetch_libs.$install)
      .toHaveBeenCalledWith(jasmine.any(Function));
    });
  });
});
