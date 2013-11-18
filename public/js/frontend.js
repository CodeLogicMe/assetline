var assetline = angular.module('assetline', ['ngRoute', 'ngAnimate']);

assetline.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/popular',
    controller: 'popularCtrl'
  })
  .when('/new', {
    templateUrl: 'partials/new_package',
    controller: 'newPackageCtrl'
  })
  .when('/new_lib', {
    templateUrl: 'partials/new_lib',
    controller: 'newLibCtrl'
  });
});

assetline.controller('popularCtrl', function($scope, $http){
  $scope.query;

  $http.get('/packages').success(function(data){
    $scope.packages = data.packages;
  });

  $scope.namesForPackage = function(pack){
    var names = [];
    angular.forEach(pack.libs, function(lib){
      names.push(lib.name + '#' + lib.version);
    });
    return names.join(', ');
  };
});

assetline.controller('newPackageCtrl', function($scope, $http){
  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });

  $scope.create = function(){
    var package = {
      libs: [$scope.libs[0]]
    };
    $http.post('/packages', package).success(function(data){
      Packages.push(data);
    });
  };
});

assetline.controller('newLibCtrl', function($scope, $http){
  $scope.newLib = {};
  $scope.types = ['JS', 'CSS'];
  $scope.editLib;

  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });

  $scope.submit = function(){
    $http.post('/libs', $scope.newLib).success(function(data){
      $scope.lib = data.lib;
      $scope.libs.push(data.lib);
      $scope.newLib = {};
    });
  };

  $scope.delete = function(lib){
    $http.delete('/libs/' + lib._id);
    $scope.libs = $scope.libs.filter(function(item){
      return item._id !== lib._id;
    });
  };

  $scope.edit = function(lib){
    $scope.editLib = angular.copy(lib);
  };

  $scope.cancelEdit = function(){
    $scope.editLib = null;
    $scope.original = null;
  };

  $scope.update = function(lib){
    $http.put('/libs/' + lib._id, lib).success(function(data){
      $scope.cancelEdit();
    });
  };
});

assetline.filter('withHost', function($location) {
  return function(input) {
    console.log($location);
    return $location.protocol()
         + '://'
         + $location.host()
         + ':'
         + $location.port()
         + '/'
         + input;
  }
});
