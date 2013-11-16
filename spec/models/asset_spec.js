var file = require("../../app/models/asset")
  , Asset = file.Asset;

describe('Asset', function(){
  var db = {get: function(){}}
      , collection = jasmine.createSpyObj('assetcolleciton', ['insert']);

  beforeEach(function(){
    spyOn(db, 'get').andReturn(collection);
  });

  describe('#constructor', function(){
    it('should initiate the variables correctly', function(){
      var args = {packages: [1,2,3]};

      var asset = new Asset(args, db);

      expect(asset.collection).toBe(collection);
      expect(asset.packages).toBe(args.packages);
    });
  });

  describe('#save', function(){
    it('should insert a new record', function(){
      var args = {
        packages: [
          {name: 'jQuery', version: '2.0'},
          {name: 'AngularJS', version: '1.2.1'}
        ],
        created_at: 'now'
      }

      var asset = new Asset(args, db);
      asset.created_at = args.created_at;

      asset.save();

      expect(collection.insert).toHaveBeenCalledWith(args);
    });
  });

  describe('#isNew', function(){
    it('should return true for a new record', function(){
      var asset = new Asset({}, db);

      expect(asset.isNew()).toBeTruthy();
    });

    it('should return false for an existing record', function(){
      var asset = new Asset({}, db);

      asset.id = '912hube1902837t'

      expect(asset.isNew()).toBeFalsy();
    });
  });
});
