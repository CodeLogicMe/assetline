var file = require("../../app/collections/asset")
  , Assets = file.Assets;

describe('Assets', function(){
  var db = {get: function(){}}
      , collection = {insert: function(){}};

  beforeEach(function(){
    spyOn(db, 'get').andReturn(collection);
  });

  describe('#constructor', function(){
    it('should initiate the variables correctly', function(){
      var assets = new Assets(db);

      expect(assets.collection).toBe(collection);
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

      var assets = new Assets(db);
      assets.insert(args, function(asset){
        expect(assets.insert).toHaveBeenCalledWith(args);
        expect(asset).toBe(args);
      });
    });
  });
});
