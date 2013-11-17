var file = require("../../app/collections/packages")
  , Packages = file.Packages;

describe('Packages', function(){
  var db = {get: function(){}}
      , collection = {insert: function(){}};

  beforeEach(function(){
    spyOn(db, 'get').andReturn(collection);
  });

  describe('#constructor', function(){
    it('should initiate the variables correctly', function(){
      var packages = new Packages(db);

      expect(packages.collection).toBe(collection);
    });
  });

  describe('#insert', function(){
    beforeEach(function(){
      spyOn(collection, 'insert').andReturn({
        success: function(){}
      });
    });

    it('should insert a new record', function(){
      var args = {
        libs: [
          {name: 'jQuery', version: '2.0', type: 'JS'},
          {name: 'AngularJS', version: '1.2.1', type: 'JS'}
        ],
        created_at: 'now'
      };

      var packages = new Packages(db);
      packages.insert(args, function(package){
        expect(packages.insert).toHaveBeenCalledWith(args);
        expect(package).toBe(args);
      });
    });
  });
});
